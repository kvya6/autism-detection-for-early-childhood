import os
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
from pydub import AudioSegment
import librosa

# -----------------------------
# Configure FFmpeg for pydub
# -----------------------------
AudioSegment.converter = r"C:\ffmpeg-8.0-essentials_build\bin\ffmpeg.exe"
AudioSegment.ffprobe = r"C:\ffmpeg-8.0-essentials_build\bin\ffprobe.exe"

# -----------------------------
# Flask App
# -----------------------------
app = Flask(__name__)
CORS(app)

# -----------------------------
# Load Audio Model
# -----------------------------
MODEL_PATH = r"D:\finalproject\main-project\Autism-Detection\rf.pkl"  # Change if needed
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model not found at {MODEL_PATH}")

audio_model = joblib.load(MODEL_PATH)
print("✅ Audio model loaded!")

# -----------------------------
# Helpers
# -----------------------------
def extract_mfcc_from_file(file_path, n_mfcc=20):
    try:
        # Load with librosa
        y, sr = librosa.load(file_path, sr=44100, mono=True, duration=5)
        mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc)
        mfcc_mean = np.mean(mfcc.T, axis=0)
        return mfcc_mean.reshape(1, -1)
    except Exception as e:
        raise RuntimeError(f"MFCC extraction failed: {e}")

# -----------------------------
# Routes
# -----------------------------
@app.route("/")
def home():
    return "<h2>Audio Prediction Server is running!</h2>"

@app.route("/predict_audio", methods=["POST"])
def predict_audio():
    if "audio" not in request.files:
        return jsonify({"error": "No audio uploaded"}), 400

    audio_file = request.files["audio"]
    temp_path = os.path.join(os.getcwd(), "temp_audio.wav")
    
    # Save uploaded file temporarily
    audio_file.save(temp_path)

    try:
        features = extract_mfcc_from_file(temp_path)
        pred = audio_model.predict(features)[0]
        label = "Autistic" if pred == 1 else "Non-Autistic"
        return jsonify({"prediction": label})
    except Exception as e:
        print("Error processing audio:", e)
        return jsonify({"error": str(e)}), 500
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

# -----------------------------
# Run
# -----------------------------
if __name__ == "__main__":
    app.run(debug=True, port=5001)
