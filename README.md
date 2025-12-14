# 🧩 Autism Detection for Early Childhood

[![Platform](https://img.shields.io/badge/Platform-Web%20%26%20Desktop-green.svg)]()
[![Frontend](https://img.shields.io/badge/Frontend-React-blue.svg)](https://react.dev/)
[![Backend](https://img.shields.io/badge/Backend-Flask%20%26%20Node.js-yellow.svg)]()
[![Machine Learning](https://img.shields.io/badge/ML-Scikit--learn%20%26%20Librosa-orange.svg)]()

> A multi-modal autism detection system for early childhood using **voice, photo, and questionnaire-based analysis**.

![Autism Detection Banner](screenshots/banner.png)

---

## ✨ Features

- 🎤 **Voice Analysis** - Upload audio files; ML model predicts autistic tendencies  
- 📸 **Photo Analysis** - Upload photos for facial/emotion-based assessment  
- 📝 **Quiz Detection** - 15-question early childhood autism questionnaire  
- 👤 **User Accounts** - Signup/Login for parents/guardians  
- 📊 **Dashboard** - Sidebar navigation for all features  
- 💬 **Feedback & Chatbot** - Interactive support and guidance  
- 🔒 **Privacy First** - Data handled locally; secure  

---

## 📱 Screenshots

<p align="center">
  <img src="screenshots/dashboard.png" width="200" />
  <img src="screenshots/upload-voice.png" width="200" />
  <img src="screenshots/upload-photo.png" width="200" />
  <img src="screenshots/quiz.png" width="200" />
</p>

---

## 🏗️ Architecture

- **Frontend**: React.js + React Router + CSS  
- **Backend**: Flask (Audio Prediction), Node.js/Express (Quiz)  
- **ML Models**: Scikit-learn Random Forest + Librosa + Joblib  
- **Audio Processing**: Pydub with FFmpeg  
- **Database**: LocalStorage (for user accounts and scores)  




###🚀 Usage

Signup/Login as a parent/guardian
Navigate Dashboard to choose:
Upload Photo for AI analysis
Upload Voice for audio-based prediction
Quiz for questionnaire-based assessment
View Prediction Results
Access Feedback & Chatbot


##Project Structure
Autism-Detection-Project/
├─ backend/
│  ├─ audio_api.py           # Flask server for audio prediction
│  ├─ rf.pkl                 # Random Forest model
├─ quiz-backend/
│  ├─ servers.js             # Express server for quiz
├─ frontend/
│  ├─ public/
│  │  ├─ dashboard_bg.jpg    # Background images
│  ├─ src/
│  │  ├─ component/
│  │  │  ├─ Dashboard.jsx
│  │  │  ├─ UploadVoice.jsx
│  │  │  ├─ UploadPhoto.jsx
│  │  │  ├─ Quiz.jsx
│  │  ├─ App.jsx
