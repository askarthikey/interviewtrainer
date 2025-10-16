import os
import pdfplumber
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    print("Warning: GEMINI_API_KEY is not set. /analyze will not work without it.")

genai.configure(api_key=GEMINI_API_KEY)

app = Flask(__name__)
CORS(app)

# Utility: extract text from PDF
# # Try to load the JSON data directly from the variable 'raw'
def extract_text_from_pdf(pdf_file):
    text = ""
    try:
        with pdfplumber.open(pdf_file) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        print(f"PDF extraction error: {e}")
    return text.strip()

# Health check
@app.route("/health", methods=["GET"])
def health():
    return {"status": "ok", "gemini_configured": bool(GEMINI_API_KEY)}

#updated the strengths, weaknesses, suggestions to be accurate using the suitable api models. 
# Analyze resume
@app.route("/analyze", methods=["POST"])
def analyze_resume():
    try:
        if not GEMINI_API_KEY:
            return jsonify({"error": "GEMINI_API_KEY not set"}), 500

        if "resume" not in request.files or "jobRole" not in request.form:
            return jsonify({"error": "Missing resume or job role"}), 400

        resume_file = request.files["resume"]
        job_role = request.form["jobRole"]

        # Extract text
        resume_text = extract_text_from_pdf(resume_file)
        if not resume_text:
            return jsonify({"error": "Could not extract text from resume"}), 400

        # Specify the model
        valid_model_name = "models/gemini-2.5-flash"

        # Generate prompt
        prompt = f"""
        You are an AI interview coach. Analyze the following resume for the role: {job_role}.
        Resume:
        {resume_text}
        Provide:
        - Strengths
        - Weaknesses
        - Suggestions to improve resume for this job role.
        """

        # Generate content
        model = genai.GenerativeModel(valid_model_name)
        response = model.generate_content(prompt)
        analysis_text = response.text

        return jsonify({"analysis": analysis_text, "model_used": valid_model_name})

    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
