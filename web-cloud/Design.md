# Design - Web & Cloud

## Tech stack Dev setup

### **Frontend**
- **Framework:** [React](https://react.dev/) with [Vite](https://vitejs.dev/) for fast development and hot module replacement.  
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) integrated for utility-first, responsive UI design.  
- **Structure:** Component-based architecture with organized folder structure for scalability.  
- **Tooling:**  
  - ESLint & Prettier for code formatting and linting.  
  - npm scripts for development (`npm run dev`) and production build (`npm run build`).  

### **Backend**
- **Runtime & Framework:** [Node.js](https://nodejs.org/) with [Express.js](https://expressjs.com/) for building RESTful APIs.  
- **Database:** [MongoDB](https://www.mongodb.com/) connected using the native MongoDB driver (no ODM for lightweight, direct queries).  
- **Configuration:** Environment variables managed via [dotenv](https://www.npmjs.com/package/dotenv).  
- **Middleware:**  
  - `cors` for handling cross-origin requests.  
  - `express.json()` for parsing JSON payloads.  

### **Dev Environment**
- **Version Control:** Git with feature-branch workflow (`origin` branches for setup, features, etc.).  
- **Package Managers:** npm for dependency management (frontend and backend managed separately).  
- **Local Development:**  
  - Frontend served via Vite development server on a local port (default: `5173`).  
  - Backend runs on Express server (port `4000`) with MongoDB connection configured via `.env`.  

---

## DB Dev setup

- **Local MongoDB Installation:**  
  Install MongoDB Community Edition locally from [mongodb.com](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas/database) for cloud-hosted development.
- **Connection:**  
  The backend connects to MongoDB using the native MongoDB Node.js driver (`mongodb` npm package).  
  Configure the connection string in the `.env` file (e.g., `MONGODB_URI=mongodb://localhost:27017/interviewtrainer`).
- **Database Initialization:**  
  No ORM/ODM is used; collections are created automatically when data is inserted.  
  Use direct queries for CRUD operations.
- **Testing:**  
  For local development, run MongoDB as a service (`mongod`) and verify connectivity using `mongo` shell or GUI tools like [MongoDB Compass](https://www.mongodb.com/products/compass).
- **Environment Variables:**  
  Store sensitive credentials and connection strings in `.env` and never commit them to version control.

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