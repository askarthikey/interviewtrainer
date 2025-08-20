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

## 1. Authentication & User Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register a new user |
| `/api/auth/login` | POST | User login – returns JWT |
| `/api/auth/logout` | POST | Invalidate session |
| `/api/auth/refresh` | POST | Refresh JWT access token |
| `/api/users/profile` | GET | Fetch logged-in user's profile |
| `/api/users/profile` | PUT | Update name, role, goals, etc. |
| `/api/users/delete` | DELETE | Delete account |

---

## 2. Resume & Job Description Upload
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/resume/upload` | POST | Upload resume (PDF/DOCX) |
| `/api/resume/parse` | POST | Extract skills, roles, experience from resume |
| `/api/job-description/upload` | POST | Upload job description (text/file) |
| `/api/job-description/parse` | POST | Extract requirements, responsibilities |
| `/api/resume/view` | GET | Get parsed resume |
| `/api/job-description/view` | GET | Get parsed JD |
| `/api/resume/score` | GET | Match score between resume & JD |

---

## 3. AI Interview Session APIs
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/interview/start` | POST | Start a new AI mock interview (resume + JD) |
| `/api/interview/:id/question` | GET | Get next AI-generated question |
| `/api/interview/:id/submit-answer` | POST | Submit answer (text/audio) |
| `/api/interview/:id/skip-question` | POST | Skip question |
| `/api/interview/:id/end` | POST | End the current session |

---

## 4. Interview Recording Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/interview/upload-recording` | POST | Upload audio/video file (WebM, MP4, etc.) |
| `/api/interview/:id/recording` | GET | Playback video/audio of the session |
| `/api/interview/:id/recording/metadata` | GET | Metadata: duration, type, size |
| `/api/interview/:id/transcript` | GET | Transcript using speech-to-text (optional) |

---

## 5. Feedback & Performance Reports
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ai/evaluate-answer` | POST | Analyze and score answer (text/audio) |
| `/api/ai/feedback` | GET | Return AI suggestions & improvement tips |
| `/api/interview/:id/report` | GET | Detailed session report: score, insights, feedback |
| `/api/interview/history` | GET | User's past interview sessions |
| `/api/interview/:id` | GET | Get full session including questions, answers, video |
| `/api/analytics/progress` | GET | Improvement graph over time |

---

## 6. Admin & Trainer Tools (Restricted)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/users` | GET | View all users |
| `/api/admin/interviews` | GET | Monitor interviews |
| `/api/admin/questions` | GET | Review all AI-generated questions |
| `/api/admin/reports/:id` | GET | View user report with analysis |


## Security

TODO(LV2402) : Fill this section based on your analysis.
