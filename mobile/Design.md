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

TODO(kmahesh18)

## Play Store Setup

TODO(Vinaykumarp2005)
