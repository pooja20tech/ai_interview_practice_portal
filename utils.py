import numpy as np
import librosa
import tensorflow as tf
import joblib

# -----------------------------
# Load Pretrained Components
# -----------------------------
MODEL_PATH = "model/audio_emotion_model.h5"
SCALER_PATH = "model/scaler.save"
ENCODER_PATH = "model/encoder.save"

model = tf.keras.models.load_model(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)
encoder = joblib.load(ENCODER_PATH)

# -----------------------------
# Feature Extraction (Same as training)
# -----------------------------
def extract_features(file_path):
    try:
        data, sr = librosa.load(file_path, sr=22050, duration=2.5, offset=0.6)

        result = np.array([])

        # ZCR
        zcr = np.mean(librosa.feature.zero_crossing_rate(y=data).T, axis=0)
        result = np.hstack((result, zcr))

        # Chroma STFT
        stft = np.abs(librosa.stft(data))
        chroma_stft = np.mean(librosa.feature.chroma_stft(S=stft, sr=sr).T, axis=0)
        result = np.hstack((result, chroma_stft))

        # MFCC
        mfcc = np.mean(librosa.feature.mfcc(y=data, sr=sr).T, axis=0)
        result = np.hstack((result, mfcc))

        # RMS
        rms = np.mean(librosa.feature.rms(y=data).T, axis=0)
        result = np.hstack((result, rms))

        # MelSpectrogram
        mel = np.mean(librosa.feature.melspectrogram(y=data, sr=sr).T, axis=0)
        result = np.hstack((result, mel))

        print(f"✅ Extracted features shape: {result.shape}")
        return result
    except Exception as e:
        print(f"❌ Error extracting features: {e}")
        return None

# -----------------------------
# Prediction Function
# -----------------------------
def predict_emotions(file_path):
    try:
        features = extract_features(file_path)
        if features is None:
            return "error", {"confident": 0, "nervous": 0, "stressed": 0}

        # Match training pipeline
        features = np.expand_dims(features, axis=0)
        features = scaler.transform(features)
        features = np.expand_dims(features, axis=2)

        # Predict
        predictions = model.predict(features)
        print("Raw model prediction:", predictions)

        # Decode
        predicted_label = encoder.inverse_transform(predictions)[0]
        print("✅ Emotion:", predicted_label)

        # Convert softmax probabilities to dict
        labels = encoder.categories_[0].tolist()
        probs = {label: float(p) for label, p in zip(labels, predictions[0])}

        print("📊 Probabilities:", probs)
        return predicted_label, probs

    except Exception as e:
        print(f"❌ Error in predict_emotions: {e}")
        return "error", {"confident": 0, "nervous": 0, "stressed": 0}
