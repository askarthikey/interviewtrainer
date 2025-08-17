# Design - Mobile

## Tech stack & Dev setup

TODO(mallikarjuna-sindiri)

## Data flow

TODO(srividyagajavalley03, syam-praneeth)
# Application

## Landing Page
- Entry point to the application

## Login / Sign Up
- User authentication interface  
- Generates authentication tokens

## JWT (JSON Web Token)
- Mechanism to securely authorize user sessions

## User Dashboard
### Features
- Scores
- Graphs
- Previous video replay
- Resume upload
- Enter job description
- Enter experience

## Resume Parsing and Preview
- Parses the uploaded resume  
- Previews the extracted information

## Interview Interface
### Capabilities
- Set timer for interview session
- Real-time question display
- Video/audio recording
- Speech-to-text conversion
- Webcam and microphone access permissions

## Feedback Module
### Post-interview Results
- Video replay
- Identification of lacking skills
- Score

<img width="1818" height="548" alt="dataflow" src="https://github.com/user-attachments/assets/fe80c0a8-d57e-459b-a068-8b397ebe7074" />



## Device APIs

TODO(anish66-dev, Ganesh-131)
# APIs
- **OpenAI / Gemini** → Question generation, answer evaluation, job description & resume analysis, code analysis, skill suggestions  
- **Google Cloud** → Text-to-Speech (TTS), Speech-to-Text (STT)  
- **MongoDB** → Storage, score/analytics, experience points  
- **JWT** → Authentication  
- **Supabase** → Video storage  
- **Affinda API** → Resume reading  
- **Azure API** → Face expression analysis  
- **ReportLab** → PDF report generation  
- **SendGrid** → Email reminders  

---

# Features & API Usage

- **Resume Reader** → MongoDB + Affinda API  
- **Job Description & Resume Analysis** → OpenAI/Gemini + Mobile UI  
- **Code Analysis** → MongoDB + OpenAI/Gemini  
- **Face Expression Analysis** → Azure API  
- **Score/Analytics** → MongoDB  
- **PDF Report** → ReportLab  
- **Skill Suggestions** → OpenAI/Gemini  
- **Experience Points** → MongoDB with React frontend  
- **Email Reminders** → SendGrid  

---

# Device APIs

## Voice & Speech
- **Voice Input** → `AudioRecord` (Android) / `AVAudioRecorder` (iOS)  
- **Speech-to-Text** → `SpeechRecognizer` (Android) / `SFSpeechRecognizer` (iOS)  
- **Text-to-Speech** → `TextToSpeech` (Android) / `AVSpeechSynthesizer` (iOS)  

## File Handling
- **Resume Upload** → `Intent.ACTION_GET_CONTENT` (Android) / `UIDocumentPickerViewController` (iOS)  
- **File Upload** → `HttpURLConnection` (Android) / `URLSession` (iOS)  
- **PDF Report Generation** → `PdfDocument` (Android) / `UIGraphicsPDFRenderer` (iOS)  
- **File Save & Share** → `MediaStore` (Android) / `UIActivityViewController` (iOS)  

## Authentication
- **Auth** → `Auth0 SDK` (Android & iOS)  

## Camera/Document Scan (Optional)
- **Camera Access** → `CameraX API` (Android) / `UIImagePickerController` (iOS)  


## Backend APIs required

# Backend API Endpoints

## Authentication
- **POST /api/auth/register** → User registration
- **POST /api/auth/login** → User authentication
- **POST /api/auth/refresh-token** → Refresh JWT token
- **POST /api/auth/logout** → User logout
- **GET /api/auth/verify-email/:token** → Email verification

## User Profile
- **GET /api/users/me** → Get current user profile
- **PUT /api/users/me** → Update user profile
- **GET /api/users/:userId/stats** → Get user statistics
- **GET /api/users/:userId/interviews** → Get user interview history

## Resume Management
- **POST /api/resumes/upload** → Upload resume file
- **GET /api/resumes/:resumeId** → Get parsed resume data
- **PUT /api/resumes/:resumeId** → Update resume information
- **DELETE /api/resumes/:resumeId** → Delete resume

## Interview Sessions
- **POST /api/interviews/create** → Create new interview session
- **GET /api/interviews/:interviewId** → Get interview details
- **PUT /api/interviews/:interviewId/complete** → Mark interview as completed
- **GET /api/interviews/:interviewId/questions** → Get interview questions
- **POST /api/interviews/:interviewId/answers** → Submit answer for review
- **GET /api/interviews/:interviewId/feedback** → Get interview feedback

## Job Descriptions
- **POST /api/jobs/analyze** → Analyze job description
- **GET /api/jobs/recommendations/:resumeId** → Get skill recommendations based on resume and job

## Video Management
- **POST /api/videos/upload** → Upload interview recording
- **GET /api/videos/:videoId** → Get video recording
- **DELETE /api/videos/:videoId** → Delete video recording

## Analytics
- **GET /api/analytics/performance** → Get performance metrics
- **GET /api/analytics/skill-gaps** → Get skill gap analysis
- **GET /api/analytics/progress** → Get progress over time

## Reports
- **GET /api/reports/generate/:interviewId** → Generate interview report
- **GET /api/reports/download/:reportId** → Download PDF report

## Notifications
- **GET /api/notifications** → Get user notifications
- **PUT /api/notifications/:notificationId/read** → Mark notification as read
- **POST /api/notifications/settings** → Update notification preferences

## Play Store Setup

TODO(Vinaykumarp2005)