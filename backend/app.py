import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
import numpy as np
from PIL import Image
import cv2
import mediapipe as mp

# -----------------------------
# Flask App
# -----------------------------
app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "model")

FACE_SIZE = (224, 224)
EYE_SIZE = (128, 128)

# -----------------------------
# Load Models
# -----------------------------
MODEL_FILES = {
    "efficientnetb0_face": os.path.join(MODEL_DIR, "efficientnetb0_face.h5"),
    "mobilenetv2_eye": os.path.join(MODEL_DIR, "mobilenetv2_eye.h5"),
}

models = {}

print("\n🔁 Loading Models…")
for name, path in MODEL_FILES.items():
    if os.path.exists(path):
        print(f"→ Loading {name}")
        models[name] = load_model(path)
    else:
        print(f"⚠️ Missing model: {path}")
print("✅ Model Loading Completed!\n")

# -----------------------------
# Mediapipe FaceMesh
# -----------------------------
mp_face_mesh = mp.solutions.face_mesh
LEFT_EYE_IDX = list(range(33, 133))
RIGHT_EYE_IDX = list(range(263, 362))


def extract_eye(bgr_image):
    """Extract left or right eye crop; return resized EYE_SIZE RGB array or None."""
    h, w = bgr_image.shape[:2]
    with mp_face_mesh.FaceMesh(static_image_mode=True, max_num_faces=1) as fm:
        result = fm.process(cv2.cvtColor(bgr_image, cv2.COLOR_BGR2RGB))
        if not result.multi_face_landmarks:
            return None
        lm = result.multi_face_landmarks[0].landmark

        def bbox(indices):
            xs = [lm[i].x * w for i in indices]
            ys = [lm[i].y * h for i in indices]
            return int(min(xs)), int(min(ys)), int(max(xs)), int(max(ys))

        for idx in [LEFT_EYE_IDX, RIGHT_EYE_IDX]:
            x1, y1, x2, y2 = bbox(idx)
            pad_x = int((x2 - x1) * 0.25)
            pad_y = int((y2 - y1) * 0.4)

            x1p = max(0, x1 - pad_x)
            y1p = max(0, y1 - pad_y)
            x2p = min(w - 1, x2 + pad_x)
            y2p = min(h - 1, y2 + pad_y)

            crop = bgr_image[y1p:y2p, x1p:x2p]
            if crop.size == 0:
                continue

            crop = cv2.resize(crop, EYE_SIZE)
            crop_rgb = cv2.cvtColor(crop, cv2.COLOR_BGR2RGB)
            return crop_rgb

    return None


# -----------------------------
# Prediction Helpers
# -----------------------------
def predict_face(img_array):
    if "efficientnetb0_face" not in models:
        return None
    img_normalized = img_array / 255.0
    pred = models["efficientnetb0_face"].predict(img_normalized, verbose=0)[0][0]
    return float(pred)


def predict_eye(img_array):
    if "mobilenetv2_eye" not in models:
        return None
    img_normalized = img_array / 255.0
    pred = models["mobilenetv2_eye"].predict(img_normalized, verbose=0)[0][0]
    return float(pred)


def ensemble(face_pred, eye_pred):
    preds = [p for p in [face_pred, eye_pred] if p is not None]
    if not preds:
        return "Unknown", 0.0
    avg = np.mean(preds)
    label = "Autistic" if avg >= 0.5 else "Non-Autistic"
    confidence = avg if avg >= 0.5 else 1 - avg
    return label, float(confidence)


# -----------------------------
# Routes
# -----------------------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Autism Detection Backend Running Successfully!",
        "endpoints": {
            "POST /predict": "Upload an image to get prediction",
            "GET /health": "Check server & model status"
        }
    })


@app.route("/predict", methods=["POST"])
def predict():
    if "photo" not in request.files:
        return jsonify({"error": "No photo uploaded"}), 400

    file = request.files["photo"]

    try:
        # Load image
        img_pil = Image.open(file.stream).convert("RGB")
        img_bgr = cv2.cvtColor(np.array(img_pil), cv2.COLOR_RGB2BGR)

        # -----------------------------
        # Face detection check
        # -----------------------------
        with mp_face_mesh.FaceMesh(static_image_mode=True, max_num_faces=5) as fm:
            result = fm.process(cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB))
            face_count = len(result.multi_face_landmarks) if result.multi_face_landmarks else 0
            print("Faces detected:", face_count)

            if face_count == 0:
                return jsonify({"error": "No face detected. Please upload a clear face photo."}), 400
            elif face_count > 1:
                return jsonify({"error": "Multiple faces detected. Please upload a photo with a single face."}), 400

        # -----------------------------
        # Face prediction
        # -----------------------------
        img_face = img_pil.resize(FACE_SIZE)
        face_arr = np.expand_dims(np.array(img_face), axis=0)
        face_pred = predict_face(face_arr)
        face_label = "Autistic" if face_pred >= 0.5 else "Non-Autistic"
        face_conf = face_pred if face_pred >= 0.5 else 1 - face_pred

        # -----------------------------
        # Eye prediction
        # -----------------------------
        eye_crop = extract_eye(img_bgr)
        eye_pred, eye_label, eye_conf = None, "Not Detected", None
        if eye_crop is not None:
            eye_arr = np.expand_dims(eye_crop.astype(np.float32), axis=0)
            eye_pred = predict_eye(eye_arr)
            eye_label = "Autistic" if eye_pred >= 0.5 else "Non-Autistic"
            eye_conf = eye_pred if eye_pred >= 0.5 else 1 - eye_pred

        # -----------------------------
        # Final ensemble
        # -----------------------------
        final_label, final_conf = ensemble(face_pred, eye_pred)

        return jsonify({
            "face_prediction": face_label,
            "face_confidence": float(face_conf),
            "eye_prediction": eye_label,
            "eye_confidence": float(eye_conf) if eye_conf else None,
            "final_prediction": final_label,
            "final_confidence": float(final_conf)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "models_loaded": list(models.keys())
    })


# -----------------------------
# Run Server
# -----------------------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)
