# app.py
import logging
import os
import re
from io import BytesIO
from typing import List, Dict, Any

from fastapi import FastAPI, UploadFile, File, Form, Body
from fastapi.middleware.cors import CORSMiddleware

import pdfplumber
from docx import Document
import requests

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
logging.basicConfig(level=logging.INFO)

AFFINDA_API_KEY = os.getenv("AFFINDA_API_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

# ----- OpenAI client
client = OpenAI(api_key=OPENAI_API_KEY)

app = FastAPI()

# CORS (tighten later if needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Backend is running fine ✅"}

@app.get("/health")
def health():
    return {"affinda": bool(AFFINDA_API_KEY), "openai": bool(OPENAI_API_KEY)}

# ---------------------------
# Local Extractors (fallback if Affinda issues)
# ---------------------------
def extract_text_from_pdf_bytes(data: bytes) -> str:
    text = ""
    with pdfplumber.open(BytesIO(data)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text() or ""
            text += page_text + "\n"
    return text

def extract_text_from_docx_bytes(data: bytes) -> str:
    doc = Document(BytesIO(data))
    return "\n".join(p.text for p in doc.paragraphs)

def extract_text(file: UploadFile, content: bytes) -> str:
    name = (file.filename or "").lower()
    if name.endswith(".pdf"):
        return extract_text_from_pdf_bytes(content)
    if name.endswith(".docx"):
        return extract_text_from_docx_bytes(content)
    # fallback for .txt or unknown
    return content.decode("utf-8", errors="ignore")

# ---------------------------
# Heuristics (kept for score + fallback)
# ---------------------------
EMAIL_RE = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}")
PHONE_RE = re.compile(r"\+?\d[\d ()\-]{8,}\d")
PCT_OR_NUM_RE = re.compile(r"(\d+%|\d+\+|reduced|increased|grew|cut|saved|improved|\b\d+[kKmM]\b|\b\d+\b)", re.I)

def parse_resume_local(text: str) -> dict:
    email = re.findall(EMAIL_RE, text)
    phone = re.findall(r"\+?\d[\d ()\-]{8,}\d", text)
    skills_list = [
        "python","java","c++","sql","javascript","react","node",
        "aws","docker","ml","ai","excel","html","css","spring","git",
        "pandas","numpy","tensorflow","pytorch","django","flask","kubernetes"
    ]
    found = []
    for skill in skills_list:
        if re.search(rf"\b{re.escape(skill)}\b", text, re.I):
            found.append(skill)
    return {
        "email": email[0] if email else None,
        "phone": phone[0] if phone else None,
        "skills": list(dict.fromkeys(found)),
        "raw_text_preview": text[:600]
    }

# Role → required skills map (you can expand this)
JOB_SKILLS = {
    "data scientist": ["python","sql","pandas","numpy","statistics","ml","scikit-learn","tensorflow","pytorch","data visualization"],
    "machine learning engineer": ["python","ml","deep learning","tensorflow","pytorch","ci/cd","aws","docker","kubernetes"],
    "software engineer": ["java","python","c++","git","docker","react","node","sql","aws"],
    "frontend developer": ["javascript","react","html","css","typescript","webpack","testing","accessibility"],
    "backend developer": ["node","express","java","spring","python","django","flask","sql","docker","aws"],
    "full stack developer": ["react","node","express","sql","typescript","docker","aws"],
    "data analyst": ["sql","excel","python","pandas","data visualization","statistics","power bi","tableau"],
    "project manager": ["communication","leadership","agile","scrum","jira","risk management","stakeholder management"]
}

def role_required_skills(job_role: str) -> List[str]:
    jr = (job_role or "").strip().lower()
    if jr in JOB_SKILLS:
        return JOB_SKILLS[jr]
    for k, v in JOB_SKILLS.items():
        if k in jr or jr in k:
            return v
    return []

# ---------------------------
# Affinda-based parsing
# ---------------------------
def parse_with_affinda(file: UploadFile, content: bytes) -> dict:
    if not AFFINDA_API_KEY:
        raise RuntimeError("AFFINDA_API_KEY not set")

    headers = {"Authorization": f"Bearer {AFFINDA_API_KEY}"}
    files = {"file": (file.filename or "resume", content)}
    # Affinda v3 resumés endpoint
    resp = requests.post("https://api.affinda.com/v3/resumes", headers=headers, files=files, timeout=60)
    if resp.status_code != 200:
        raise RuntimeError(f"Affinda error {resp.status_code}: {resp.text}")

    data = resp.json() or {}
    core = (data.get("data") or {})

    # Build details object normalized for our UI
    details = {
        "email": (core.get("contactInfo") or {}).get("email"),
        "phone": (core.get("contactInfo") or {}).get("phone"),
        "skills": [s.get("name") for s in (core.get("skills") or []) if s.get("name")],
        "experience": [
            {
                "jobTitle": (w or {}).get("jobTitle"),
                "organization": (w or {}).get("organization"),
                "dates": {"start": (w or {}).get("dates", {}).get("startDate"),
                          "end": (w or {}).get("dates", {}).get("endDate")},
                "highlights": (w or {}).get("highlights") or []
            }
            for w in (core.get("workExperience") or [])
        ],
        "education": [
            {
                "organization": (e or {}).get("organization"),
                "accreditation": (e or {}).get("accreditation"),
                "grade": (e or {}).get("grade"),
                "dates": (e or {}).get("dates")
            }
            for e in (core.get("education") or [])
        ],
        "certifications": [c.get("name") for c in (core.get("certifications") or []) if c.get("name")]
    }

    # Keep a preview text if available
    if not details.get("email") and core.get("contactInfo", {}).get("emails"):
        details["email"] = (core["contactInfo"]["emails"] or [None])[0]

    return details

# ---------------------------
# OpenAI suggestion generation
# ---------------------------
def generate_ai_suggestions(details: dict, job_role: str, missing: List[str]) -> List[str]:
    """
    Use OpenAI to produce practical, tailored, corporate-grade suggestions.
    """
    if not OPENAI_API_KEY:
        # Safeguard: fallback quick suggestions
        base = []
        if missing:
            base.append(f"Add or strengthen these {job_role} skills: {', '.join(missing[:6])}.")
        if not details.get("email") or not details.get("phone"):
            base.append("Include a professional email and phone in the header.")
        base.append("Quantify outcomes (e.g., “reduced costs by 18%”, “cut latency by 220ms”).")
        if job_role:
            base.append(f"Tailor your top bullets to {job_role}; lead with tools, action, measurable impact.")
        return base

    # Trim potentially huge payloads
    short_details = {
        "email": details.get("email"),
        "phone": details.get("phone"),
        "skills": details.get("skills", [])[:50],
        "experience": [
            {
                "jobTitle": (e or {}).get("jobTitle"),
                "organization": (e or {}).get("organization"),
                "highlights": (e or {}).get("highlights", [])[:3]
            }
            for e in (details.get("experience") or [])[:5]
        ],
        "education": details.get("education", [])[:3],
        "certifications": details.get("certifications", [])[:5],
    }

    prompt = (
        "You are a senior hiring manager and resume coach. Read the candidate details and produce 5–7 "
        "actionable, specific resume improvement suggestions suitable for a corporate audience. "
        "Avoid generic advice; cite tools, metrics, and outcomes where possible. "
        "Be concise, bullet-style sentences.\n\n"
        f"Target job role: {job_role or 'N/A'}\n"
        f"Missing skills vs JD: {', '.join(missing) if missing else 'None'}\n"
        f"Candidate details (JSON): {short_details}\n\n"
        "Return plain bullets, no numbering."
    )

    try:
        resp = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.4,
            max_tokens=350,
        )
        text = resp.choices[0].message.content.strip()
        # Split into bullets safely
        lines = [l.strip("-• ").strip() for l in text.split("\n") if l.strip()]
        # Deduplicate while preserving order
        final, seen = [], set()
        for l in lines:
            if l and l not in seen:
                final.append(l); seen.add(l)
        return final[:8] if final else ["Tighten your summary to match the job, add metrics to top bullets, and align skills with the JD."]
    except Exception as e:
        logging.exception("OpenAI suggestion error")
        # Fallback minimal suggestions
        fb = []
        if missing:
            fb.append(f"Add or strengthen these {job_role} skills: {', '.join(missing[:6])}.")
        fb.append("Add metrics to bullets (%, time saved, revenue impact).")
        return fb

# ---------------------------
# /analyze — AI-powered now
# ---------------------------
@app.post("/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    job_role: str = Form(...)
):
    try:
        logging.info(f"Received file: {file.filename} | role: {job_role}")
        content = await file.read()

        # Prefer Affinda, fallback to local parsing
        try:
            details = parse_with_affinda(file, content)
            logging.info("Parsed with Affinda.")
        except Exception as aff_err:
            logging.warning(f"Affinda failed, falling back to local parse. Reason: {aff_err}")
            text = extract_text(file, content)
            details = parse_resume_local(text)

        # Skill comparison for score
        required = role_required_skills(job_role)
        have = set([s.lower() for s in details.get("skills", [])])
        matched = [s for s in required if s.lower() in have]
        missing = [s for s in required if s.lower() not in have]
        score = round((len(matched) / len(required)) * 100) if required else None

        # AI suggestions
        suggestions = generate_ai_suggestions(details, job_role, missing)

        return {
            "filename": file.filename,
            "job_role": job_role,
            "parsed_details": details,
            "required_skills": required,
            "matched_skills": matched,
            "missing_skills": missing,
            "resume_score": score,
            "suggestions": suggestions
        }

    except Exception as e:
        logging.exception("Analyze error")
        return {"error": str(e)}

# ---------------------------
# /interview — AI interview loop
# ---------------------------
class Turn(BaseException):  # tiny trick to avoid pydantic imports; not used, just to keep file minimal
    pass

@app.post("/interview")
def interview(
    payload: Dict[str, Any] = Body(..., example={
        "job_role": "Software Developer",
        "history": [
            {"role": "system", "content": "You are an interviewer."},
            {"role": "assistant", "content": "Tell me about yourself."},
            {"role": "user", "content": "I am a software developer with 2 years..."}
        ]
    })
):
    """
    Stateless interview turn:
      - Send history (chat format) + job_role
      - Returns next question and feedback on last user answer (if any)
    You can store history on the client (frontend) and resend each turn.
    """
    job_role = (payload or {}).get("job_role") or "General"
    history = (payload or {}).get("history") or []

    sys_prompt = (
        f"You are a structured, concise interviewer for a {job_role} role at a Fortune 500 company. "
        "Ask one high-quality question at a time. If the candidate answered in the last turn, first provide a brief, "
        "professional feedback paragraph (strengths + 1–2 concrete improvements), then ask the next question. "
        "Keep total reply under 120 words. Avoid fluff."
    )
    messages = [{"role": "system", "content": sys_prompt}] + history

    try:
        resp = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=messages,
            temperature=0.4,
            max_tokens=220
        )
        content = resp.choices[0].message.content.strip()
        return {"reply": content}
    except Exception as e:
        logging.exception("Interview error")
        return {"error": str(e), "reply": "Sorry, I hit an issue. Please try again."}
