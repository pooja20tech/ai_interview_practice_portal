import numpy as np
import librosa
import tensorflow as tf
import joblib

# -----------------------------
# Load Pretrained Components
# -----------------------------
MODEL_PATH = "audio_emotion_model.h5"
SCALER_PATH = "scaler.save"
ENCODER_PATH = "encoder.save"

# Load model, scaler, and label encoder
model = tf.keras.models.load_model(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)
encoder = joblib.load(ENCODER_PATH)

# -----------------------------
# Feature Extraction
# -----------------------------
def extract_features(file_path):
    try:
        # Load audio
        data, sr = librosa.load(file_path, sr=22050, duration=3, offset=0.5)

        features = np.array([])

        # Zero Crossing Rate
        zcr = np.mean(librosa.feature.zero_crossing_rate(y=data).T, axis=0)
        features = np.hstack((features, zcr))

        # Chroma STFT
        stft = np.abs(librosa.stft(data))
        chroma = np.mean(librosa.feature.chroma_stft(S=stft, sr=sr).T, axis=0)
        features = np.hstack((features, chroma))

        # MFCC
        mfcc = np.mean(librosa.feature.mfcc(y=data, sr=sr).T, axis=0)
        features = np.hstack((features, mfcc))

        # RMS
        rms = np.mean(librosa.feature.rms(y=data).T, axis=0)
        features = np.hstack((features, rms))

        # Mel Spectrogram
        mel = np.mean(librosa.feature.melspectrogram(y=data, sr=sr).T, axis=0)
        features = np.hstack((features, mel))

        return features

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
            return "error", {}, 0

        # Preprocess for model
        features = np.expand_dims(features, axis=0)
        features = scaler.transform(features)

        # Predict probabilities
        predictions = model.predict(features)
        predictions = predictions[0]

        # Get predicted emotion
        predicted_index = np.argmax(predictions)
        predicted_label = encoder.inverse_transform([predicted_index])[0]

        # Probabilities dict
        labels = encoder.categories_[0].tolist()
        probs = {label: float(pred) for label, pred in zip(labels, predictions)}

        # Score out of 10
        score = int(predictions[predicted_index] * 10)

        return predicted_label, probs, score

    except Exception as e:
        print(f"❌ Error predicting emotion: {e}")
        return "error", {}, 0
