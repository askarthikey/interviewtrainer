# Design - Web & Cloud

## Tech stack Dev setup

TODO(askarthikey): Fill this section based on your analysis.

## DB Dev setup

TODO(Sairoop-15): Fill this section based on your analysis.

## Data flow diagram

TODO(Rishi2795, srivatsav7054, K-Jashwanth): Fill this section based on your analysis.

## Database schema

TODO(Karthik-Kondaveeti): Fill this section based on your analysis.

## List of APIs

TODO(Rishidhar-22): Fill this section based on your analysis.

## Security(LV2402)

🔐 *SECURITY & AUTHENTICATION ASPECTS FOR INTERVIEWTRAINER (V2)*

### 1. User Authentication
✅ *Aspects:*
- Secure Login System (Email + Password, OAuth, SSO)
- Account Verification (Email verification / OTP)
- Password Policies (Minimum length, complexity, expiry)
- Forgot Password Flow (Secure token-based reset)

🎯 *Design:*
- Use JWT (JSON Web Tokens) or OAuth 2.0 for secure sessions.
- Hash passwords using *bcrypt* or *argon2*.
- Support Google/LinkedIn Login (good for job seekers).
- Add *2FA (Two-Factor Authentication)* for added security.

---

### 2. Role-Based Access Control (RBAC)
✅ *Aspects:*
- Define user roles: User, Admin, Evaluator
- Prevent privilege escalation

🎯 *Design:*
- Implement middleware to check access rights on APIs.
- Use isAdmin, isUser, etc., flags with secure backend enforcement.

---

### 3. Secure File Upload & Storage
✅ *Aspects:*
- Prevent file-based attacks (*clamav.js*)
- Ensure files are not publicly accessible — only authenticated users (or admin) should access their files.

🎯 *Design:*
- Allow only certain file types (.pdf, .docx)
- Use anti-virus scanning (*clamav.js*)
- Store files in private cloud buckets (e.g., AWS S3 with signed URLs)
- Use *presigned URLs* for uploads/downloads

---

### 4. API Security
✅ *Aspects:*
- Prevent unauthorized access to APIs
- Input sanitization and validation

🎯 *Design:*
- Use API keys or tokens for accessing protected endpoints
- Validate and sanitize all input (avoid injection attacks)
- Implement *rate limiting* and throttling

---

### 5. Session Management
✅ *Aspects:*
- Prevent session hijacking
- Auto logout / session timeout

🎯 *Design:*
- Use *HTTPOnly* and *Secure* cookies
- Use token expiry and refresh tokens
- Invalidate tokens on logout/change password

---

### 6. Security Logging and Monitoring
✅ *Aspects:*
- Detect suspicious activity, account misuse

🎯 *Design:*
- Audit logs for logins, uploads, API calls
- Integrate with monitoring tools (e.g., Sentry, Datadog, or ELK stack)
- Alerts for failed logins, multiple reset requests, etc.

---

### 7. Recording Security (Video/Audio)
✅ *Aspects:*
- Protect user-recorded mock interview videos

🎯 *Design:*
- Store encrypted videos (e.g., *AES256* in S3 bucket)
- Control access via signed URLs with expiry