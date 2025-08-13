# Design - Data & AI

## Data Collection

TODO(srividyaguthi): Fill this section based on your analysis.

## Sample dataset

TODO(amulya-naalla): Fill this section based on your analysis.

## Generic chatbots

TODO(Manikanta6205): Fill this section based on your analysis.

## Pre-built APIs
TODO(swayamj2495): Fill this section based on your analysis.

Pre - built apis which we might use in this particular project are as follows:-

1.Speech-to-Text (Voice Input):-

  a)Google Cloud Speech-to-Text

  b)Microsoft Azure Speech Service

  c)Deepgram

2.Question Generation:-

  a)OpenAI GPT

3.Answer Analysis / Scoring:-

  a)OpenAI GPT

  b)Hugging Face Inference API

4.Feedback Generation:-

  a)OpenAI GPT

5.Text-to-Speech (Ask Questions Aloud):-

  a)Amazon Polly

  b)Google Cloud Text-to-Speech

As per the requirement of the product we can then think of more API's we want to use.
## Vision Algorithms

TODO(mythrimutyapu7): Fill this section based on your analysis.

## Privacy

TODO(Aishwarya0322) : Fill this section based on your analysis.

1. Personally Identifiable Information (PII) Exposure
Issue: Names, emails, face/voice data can reveal identity.
Mitigation: Use candidate IDs, anonymize data, and encrypt PII.

2. Unauthorized Access
Issue: Sensitive data may be accessed by hackers or unapproved users.
Mitigation: Apply RBAC, enable 2FA, and use encryption at rest & in transit.

3. No User Consent
Issue: Users may not know data is being collected or used.
Mitigation: Use clear consent forms; explain data use; allow opt-out.

4. Video/Audio Risks
Issue: Raw recordings can be misused (e.g., for facial recognition).
Mitigation: Extract only features needed (e.g., tone/confidence); delete raw files.

5. Over-collection of Data
Issue: Unnecessary data like age or gender may be collected.
Mitigation: Collect only essential data needed for interview analysis.

6. Third-party Sharing Risks
Issue: Shared data could be leaked or misused.
Mitigation: Share only anonymized data; sign DPAs; ensure vendor compliance.

7. No Data Retention Policy
Issue: Data stored indefinitely without user knowledge.
Mitigation: Set auto-delete rules (e.g., 30–60 days); allow users to delete their data.

8. AI Bias
Issue: AI may provide unfair feedback based on gender, accent, etc.
Mitigation: Train on diverse data; exclude sensitive features; audit regularly.
9. Unsafe File Uploads
Issue: Files may carry malware or sensitive content.
Mitigation: Sanitize, validate, and store files securely; scan for threats.

10. Lack of Transparency
Issue: Users don’t know how their data is used or who sees it.
Mitigation: Provide clear privacy policy and visible data settings.

