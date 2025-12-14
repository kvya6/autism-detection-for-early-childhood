import os
import math
import cv2
import numpy as np
import mediapipe as mp
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import EfficientNetB0, MobileNetV2
from tensorflow.keras.layers import GlobalAveragePooling2D, Dense, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping

# -----------------------------
# CONFIG
# -----------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = r"D:\finalproject\main-project\Autism-detection-for-early-childhood\backend\datasets"
TRAIN_DIR = os.path.join(DATASET_DIR, "train")
VALID_DIR = os.path.join(DATASET_DIR, "valid")
TEST_DIR = os.path.join(DATASET_DIR, "test")

MODEL_DIR = os.path.join(BASE_DIR, "model")
os.makedirs(MODEL_DIR, exist_ok=True)

# Image sizes
FACE_SIZE = (224, 224)
EYE_SIZE = (128, 128)

# Training params
BATCH_SIZE_FACE = 16
BATCH_SIZE_EYE = 32
STAGE1_EPOCHS = 6
STAGE2_EPOCHS = 14
SEED = 42

# Mediapipe FaceMesh (for eye extraction)
mp_face_mesh = mp.solutions.face_mesh
LEFT_EYE_IDX = list(range(33, 133))
RIGHT_EYE_IDX = list(range(263, 362))

# -----------------------------
# Utilities
# -----------------------------

def list_classes(path):
    return sorted([d.name for d in os.scandir(path) if d.is_dir()])

CLASSES = list_classes(TRAIN_DIR)
print("Detected classes:", CLASSES)

def extract_eye(bgr_image):
    """Extract left or right eye crop; return resized EYE_SIZE RGB array or None."""
    h, w = bgr_image.shape[:2]
    with mp_face_mesh.FaceMesh(static_image_mode=True, max_num_faces=1) as fm:
        result = fm.process(cv2.cvtColor(bgr_image, cv2.COLOR_BGR2RGB))
        if not result.multi_face_landmarks:
            return None
        lm = result.multi_face_landmarks[0].landmark

        def bbox(indices):
            xs = [lm[i].x * w for i in indices if i < len(lm)]
            ys = [lm[i].y * h for i in indices if i < len(lm)]
            if not xs or not ys:
                return None
            return int(min(xs)), int(min(ys)), int(max(xs)), int(max(ys))

        for idx in [LEFT_EYE_IDX, RIGHT_EYE_IDX]:
            box = bbox(idx)
            if box:
                x1, y1, x2, y2 = box
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
# Generators
# -----------------------------

face_train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=20,
    width_shift_range=0.12,
    height_shift_range=0.12,
    zoom_range=0.15,
    horizontal_flip=True,
)
face_valid_datagen = ImageDataGenerator(rescale=1./255)

face_train_gen = face_train_datagen.flow_from_directory(
    TRAIN_DIR, target_size=FACE_SIZE, batch_size=BATCH_SIZE_FACE, class_mode="binary", seed=SEED
)
face_valid_gen = face_valid_datagen.flow_from_directory(
    VALID_DIR, target_size=FACE_SIZE, batch_size=BATCH_SIZE_FACE, class_mode="binary", seed=SEED
)
face_test_gen = face_valid_datagen.flow_from_directory(
    TEST_DIR, target_size=FACE_SIZE, batch_size=BATCH_SIZE_FACE, class_mode="binary", shuffle=False
)

def eye_gen_from_face(face_gen):
    while True:
        x_batch, y_batch = next(face_gen)
        eye_batch = []
        for img in x_batch:
            bgr = cv2.cvtColor((img*255).astype(np.uint8), cv2.COLOR_RGB2BGR)
            eye_rgb = extract_eye(bgr)
            if eye_rgb is None:
                eye_rgb = cv2.resize(cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB), EYE_SIZE)
            eye_batch.append(eye_rgb.astype(np.float32)/255.0)
        yield np.stack(eye_batch, axis=0), y_batch

eye_train_gen = eye_gen_from_face(face_train_gen)
eye_valid_gen = eye_gen_from_face(face_valid_gen)

steps_face_train = math.ceil(face_train_gen.samples / BATCH_SIZE_FACE)
steps_face_valid = math.ceil(face_valid_gen.samples / BATCH_SIZE_FACE)
steps_eye_train = math.ceil(face_train_gen.samples / BATCH_SIZE_EYE)
steps_eye_valid = math.ceil(face_valid_gen.samples / BATCH_SIZE_EYE)

# -----------------------------
# Model builders
# -----------------------------

def build_face_model():
    base = EfficientNetB0(weights="imagenet", include_top=False, input_shape=(FACE_SIZE[0], FACE_SIZE[1],3))
    base.trainable = False
    x = GlobalAveragePooling2D()(base.output)
    x = Dropout(0.35)(x)
    out = Dense(1, activation="sigmoid")(x)
    model = Model(base.input, out)
    model.compile(optimizer=Adam(1e-4), loss="binary_crossentropy", metrics=["accuracy"])
    return model, base

def build_eye_model():
    base = MobileNetV2(weights="imagenet", include_top=False, input_shape=(EYE_SIZE[0], EYE_SIZE[1],3))
    base.trainable = False
    x = GlobalAveragePooling2D()(base.output)
    x = Dropout(0.35)(x)
    out = Dense(1, activation="sigmoid")(x)
    model = Model(base.input, out)
    model.compile(optimizer=Adam(1e-4), loss="binary_crossentropy", metrics=["accuracy"])
    return model, base

# -----------------------------
# Training
# -----------------------------

face_model, face_base = build_face_model()
face_ckpt = ModelCheckpoint(os.path.join(MODEL_DIR, "efficientnetb0_face.h5"), save_best_only=True, monitor="val_accuracy", mode="max")
face_es = EarlyStopping(monitor="val_loss", patience=6, restore_best_weights=True)

print(">>> Training face model (stage 1)...")
face_model.fit(
    face_train_gen,
    steps_per_epoch=steps_face_train,
    validation_data=face_valid_gen,
    validation_steps=steps_face_valid,
    epochs=STAGE1_EPOCHS,
    callbacks=[face_ckpt, face_es]
)

print(">>> Fine-tuning face model (stage 2)...")
face_base.trainable = True
face_model.compile(optimizer=Adam(1e-5), loss="binary_crossentropy", metrics=["accuracy"])
face_model.fit(
    face_train_gen,
    steps_per_epoch=steps_face_train,
    validation_data=face_valid_gen,
    validation_steps=steps_face_valid,
    epochs=STAGE2_EPOCHS,
    callbacks=[face_ckpt, face_es]
)

print("Evaluating face model on test set:")
face_model.load_weights(os.path.join(MODEL_DIR, "efficientnetb0_face.h5"))
res_face = face_model.evaluate(face_test_gen)
print("Face test results:", res_face)

eye_model, eye_base = build_eye_model()
eye_ckpt = ModelCheckpoint(os.path.join(MODEL_DIR, "mobilenetv2_eye.h5"), save_best_only=True, monitor="val_accuracy", mode="max")
eye_es = EarlyStopping(monitor="val_loss", patience=6, restore_best_weights=True)

print(">>> Training eye model (stage 1)...")
eye_model.fit(
    eye_train_gen,
    steps_per_epoch=steps_eye_train,
    validation_data=eye_valid_gen,
    validation_steps=steps_eye_valid,
    epochs=STAGE1_EPOCHS,
    callbacks=[eye_ckpt, eye_es]
)

print(">>> Fine-tuning eye model (stage 2)...")
eye_base.trainable = True
eye_model.compile(optimizer=Adam(1e-5), loss="binary_crossentropy", metrics=["accuracy"])
eye_model.fit(
    eye_train_gen,
    steps_per_epoch=steps_eye_train,
    validation_data=eye_valid_gen,
    validation_steps=steps_eye_valid,
    epochs=STAGE2_EPOCHS,
    callbacks=[eye_ckpt, eye_es]
)

print("Training complete. Models saved in:", MODEL_DIR)