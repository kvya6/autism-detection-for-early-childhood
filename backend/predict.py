import os
import sys
import cv2
import numpy as np
from mtcnn import MTCNN
from tensorflow.keras.models import load_model
from flask import Flask, request, jsonify

# -------------------- Load model & detectors --------------------
model = load_model("model/asd_classifier.h5")
detector = MTCNN()
haar = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

UPLOAD_FOLDER = "media"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# -------------------- Preprocess image --------------------
def preprocess_image(img_path):
    img = cv2.imread(img_path)
    if img is None:
        raise ValueError("❌ Could not read image. Check file path or format.")
    
    # Resize if too large
    max_dim = 800
    h, w = img.shape[:2]
    if max(h, w) > max_dim:
        scale = max_dim / max(h, w)
        img = cv2.resize(img, (int(w*scale), int(h*scale)))
    
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    # Try MTCNN first
    results = detector.detect_faces(img_rgb)
    if results:
        x, y, w, h = results[0]['box']
        x, y = max(0, x), max(0, y)
        face = img_rgb[y:y+h, x:x+w]
    else:
        # Fallback Haar Cascade
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = haar.detectMultiScale(gray, 1.3, 5)
        if len(faces) == 0:
            raise ValueError("❌ No face detected. Use a clear, frontal photo.")
        x, y, w, h = faces[0]
        face = img[y:y+h, x:x+w]

    # Resize to model input
    face = cv2.resize(face, (224, 224))
    face = face / 255.0
    face = np.expand_dims(face, axis=0)
    return face

# -------------------- Prediction --------------------
def predict_image(img_path):
    try:
        face_img = preprocess_image(img_path)
        pred = model.predict(face_img)[0][0]
        return "ASD" if pred > 0.5 else "No Autism"
    except Exception as e:
        return f"Photo analysis failed: {str(e)}"

# -------------------- Flask app --------------------
app = Flask(__name__)

@app.route("/predict", methods=["POST"])
def predict_route():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    file = request.files['file']
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)
    
    result = predict_image(file_path)
    return jsonify({"prediction": result})

# -------------------- CLI support --------------------
if __name__ == "__main__":
    if len(sys.argv) > 1:
        img_path = sys.argv[1]
        print(predict_image(img_path))
    else:
        app.run(debug=True)

