# 🧩 Autism Detection for Early Childhood

[![Platform](https://img.shields.io/badge/Platform-Web%20%26%20Desktop-green.svg)]()
[![Frontend](https://img.shields.io/badge/Frontend-React-blue.svg)](https://react.dev/)
[![Backend](https://img.shields.io/badge/Backend-Flask%20%26%20Node.js-yellow.svg)]()
[![Machine Learning](https://img.shields.io/badge/ML-Scikit--learn%20%26%20Librosa-orange.svg)]()

> A multi-modal autism screening support system for early childhood using voice, photo, video, and questionnaire-based analysis, with a voice assistant for guidance and an AI consultation summarizer for doctor/therapist visits.

![Autism Detection Banner](screenshots/banner.png)

---

## ✨ Features
Core features
🎤 Voice Analysis - Upload audio files; ML model predicts autistic tendencies
📸 Photo Analysis - Upload photos for facial/emotion-based assessment
📝 Quiz Detection - 15-question early childhood autism questionnaire
👤 User Accounts - Signup/Login for parents/guardians
📊 Dashboard - Sidebar navigation for all features
💬 Feedback & Chatbot - Interactive support and guidance
🔒 Privacy First - Data handled locally; secure

---

## 📱 Screenshots

<p align="center">
  <img src="https://raw.githubusercontent.com/kvya6/autism-detection-for-early-childhood/main/homepage.jpg" width="1000" />
  <img src="https://raw.githubusercontent.com/kvya6/autism-detection-for-early-childhood/main/photoanalysis.jpg" width="1000" />
  <img src="https://raw.githubusercontent.com/kvya6/autism-detection-for-early-childhood/main/voiceanalysis.jpg" width="1000" />
  <img src="https://raw.githubusercontent.com/kvya6/autism-detection-for-early-childhood/main/chatbot.jpg" width="1000" />
  <img src="https://raw.githubusercontent.com/kvya6/autism-detection-for-early-childhood/main/gamedashboard.jpg" width="1000" />
</p>


---
##🆕 New features
🗣️ Low-Latency Voice Assistant - Talk to the chatbot hands-free. Streaming speech-to-text → LLM → text-to-speech, with interruption handling (speak while the assistant is talking and it stops immediately).
📋 Consultation Summarizer - Upload a recording of a doctor/therapist visit. Get a transcript with speaker labels (Parent / Doctor), a structured summary, action items, and a searchable archive.
🎬 Video Q&A - Upload a video of your child and ask questions such as "When did the child make eye contact?". Answers come with clickable timestamps that jump the video to the right moment.

## 🏗️ Architecture
Layer	Technology
Frontend	React.js, React Router, CSS
Backend (audio prediction)	Flask
Backend (quiz)	Node.js / Express
Backend (new AI services)	Flask / FastAPI, WebSockets
ML models	Scikit-learn Random Forest, Librosa, Joblib
Audio processing	Pydub, FFmpeg
Speech-to-text	faster-whisper (local), Silero VAD
Speaker labeling	pyannote.audio
Text-to-speech	Piper (local)
LLM	Ollama (local, default) or a cloud LLM (optional, see Privacy)
Video processing	OpenCV, MediaPipe, vision-language model for captions
Search / embeddings	ChromaDB or SQLite + FAISS
Database	SQLite / PostgreSQL (replaces LocalStorage for records)
High-level flow
                        ┌──────────────────────────┐
                        │   React Frontend         │
                        │ Dashboard · Upload · Quiz│
                        │ VoiceChat · Sessions ·   │
                        │ Video Q&A                │
                        └────────────┬─────────────┘
                                     │
        ┌──────────────┬─────────────┼───────────────┬──────────────┐
        ▼              ▼             ▼               ▼              ▼
  Flask audio     Express quiz   WebSocket       Sessions API    Video API
  prediction      backend        voice service   (summarizer)    (Video Q&A)
  (RF model)                     STT→LLM→TTS     Whisper+LLM     Whisper+CV+LLM
        │                              │               │              │
        └──────────────────────────────┴───────┬───────┴──────────────┘
                                               ▼
                                   SQLite/Postgres + Vector store
🧠 How the New Features Work
🗣️ Low-Latency Voice Assistant
The browser streams microphone audio to the backend over a WebSocket.
Silero VAD detects when the user starts and stops speaking.
faster-whisper transcribes speech to text.
The LLM streams its reply token by token; the first complete sentence is sent to Piper TTS immediately, so the assistant starts speaking before the full answer is generated.
Interruption handling: if VAD detects the user speaking while the assistant is talking, the LLM stream is cancelled and audio playback stops.
The app logs response latency (end of user speech → first audio) for performance tracking.

A lightweight fallback using the browser's built-in Web Speech API is available when the streaming backend is not running.

📋 Consultation Summarizer
Upload a recording (converted via the existing Pydub/FFmpeg pipeline).
Transcribe with faster-whisper (timestamped).
Label speakers (Parent / Doctor) with pyannote.audio diarization.
An LLM produces structured JSON: summary, parent_concerns, recommendations, action_items, follow_up_date.
Transcript chunks are embedded and stored for search.
Ask questions like "What did the doctor say about speech therapy?" and get an answer with the matching timestamp.
🎬 Video Q&A
Extract audio and transcribe with timestamps.
Sample frames every 2-3 seconds with OpenCV.
Caption each segment with a vision-language model and compute behavior signals with MediaPipe (e.g., gaze direction, response to name call, repetitive movement).
Store each segment as {start, end, transcript, caption, signals} and embed it.
For a question, retrieve the best-matching segments, have the LLM answer, and return the timestamps.
In the UI, timestamps are clickable and seek the video player.

Video and voice outputs are phrased as observations (for example, "child did not turn when name was called at 0:42"), never as a diagnosis.

🚀 Usage
Sign up / log in as a parent or guardian and accept the consent screen.
Use the Dashboard to choose:
📸 Upload Photo for AI analysis
🎤 Upload Voice for audio-based prediction
📝 Quiz for questionnaire-based assessment
🎬 Video Analysis to upload a video and ask questions about it
📋 Consultation Notes to upload and search doctor/therapist visit recordings
🗣️ Voice Assistant to talk to the chatbot hands-free
View prediction results.
Access Feedback & Chatbot.
📁 Project Structure
Autism-Detection-Project/
├─ backend/
│  ├─ audio_api.py        # Flask server for audio prediction
│  ├─ rf.pkl              # Random Forest model
│  ├─ voice_ws.py         # NEW: streaming voice assistant (WebSocket)
│  ├─ sessions_api.py     # NEW: consultation summarizer + search
│  ├─ video_api.py        # NEW: video Q&A
│  ├─ db.py               # NEW: SQLite/Postgres data layer
│  ├─ requirements.txt
│  └─ .env.example
├─ quiz-backend/
│  └─ servers.js          # Express server for quiz
├─ frontend/
│  ├─ public/
│  │  └─ dashboard_bg.jpg # Background images
│  └─ src/
│     ├─ component/
│     │  ├─ Dashboard.jsx
│     │  ├─ UploadVoice.jsx
│     │  ├─ UploadPhoto.jsx
│     │  ├─ Quiz.jsx
│     │  ├─ VoiceChat.jsx     # NEW
│     │  ├─ Sessions.jsx      # NEW
│     │  ├─ UploadVideo.jsx   # NEW
│     │  └─ Consent.jsx       # NEW
│     └─ App.jsx
└─ README.md
⚙️ Installation
Prerequisites
Node.js 18+
Python 3.10+
FFmpeg installed and available on your PATH
(Recommended) Ollama for a fully local LLM
A Hugging Face token (required by pyannote.audio for speaker labeling)
1. Clone
bash
git clone <your-repo-url>
cd Autism-Detection-Project
2. Backend (Python)
bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # then edit values

Suggested requirements.txt additions for the new features:

flask
flask-cors
flask-sock
fastapi
uvicorn
librosa
pydub
joblib
scikit-learn
faster-whisper
silero-vad
pyannote.audio
piper-tts
opencv-python
mediapipe
chromadb
sqlalchemy

Example .env:

LLM_PROVIDER=ollama             # ollama | cloud
OLLAMA_MODEL=llama3.1
WHISPER_MODEL=small
HF_TOKEN=your_huggingface_token
DATABASE_URL=sqlite:///autism_app.db

Run the services:

bash
python audio_api.py             # audio prediction
python voice_ws.py              # voice assistant (WebSocket)
python sessions_api.py          # consultation summarizer
python video_api.py             # video Q&A
3. Quiz backend (Node.js)
bash
cd quiz-backend
npm install
node servers.js
4. Frontend (React)
bash
cd frontend
npm install
npm start

The app runs at http://localhost:3000.

🔒 Privacy, Consent & Safety
Local by default: with LLM_PROVIDER=ollama, all transcription, speech synthesis, LLM calls, and video analysis run on your machine and no child data leaves it.
Cloud option: if you switch LLM_PROVIDER to a cloud service, transcripts and summaries are sent to that provider. In this mode, the "data handled locally" guarantee no longer applies, so inform users and obtain explicit consent.
Parental consent: the app shows a consent screen before any child's audio, photo, or video is processed. Children's data is sensitive; if you deploy in India, review obligations under the Digital Personal Data Protection Act, 2023 (including verifiable parental consent).
Data control: users can delete their recordings, transcripts, and results at any time.
No diagnosis: all outputs are screening observations. The app always recommends consulting a qualified professional.
📊 Evaluation & Limitations
The Random Forest audio model is trained on a limited dataset; report precision, recall, and F1, not accuracy alone, and treat results as indicative only.
Photo and video analysis can be affected by lighting, camera angle, age, and cultural differences in expression, and may produce false positives or negatives.
Voice assistant latency is measured (end of speech → first audio) and logged; target is under ~1.5 seconds on a modern laptop with a small Whisper model.
Speaker labeling accuracy drops with overlapping speech and noisy rooms.
🗺️ Roadmap
 Voice, photo, and quiz screening
 User accounts and dashboard
 Feedback & chatbot
 Streaming voice assistant with interruption handling
 Consultation summarizer with searchable archive
 Video Q&A with timestamped answers
 Migrate LocalStorage to SQLite/Postgres
 Multi-language support (Hindi, Kannada, Tamil, etc.)
 Clinician-facing report export (PDF)
🤝 Contributing

Contributions are welcome. Please open an issue to discuss major changes before submitting a pull request.


🙏 Acknowledgements

Librosa, scikit-learn, faster-whisper, Silero VAD, pyannote.audio, Piper, OpenCV, MediaPipe, Ollama, and the open-source community.
