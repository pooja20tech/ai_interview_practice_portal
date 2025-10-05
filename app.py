from flask import Flask, request, jsonify
import librosa
import numpy as np
import tempfile
import os

app = Flask(__name__)

# -------------------------
# Voice Analysis Function
# -------------------------
def analyze_voice(audio_path):
    try:
        # Load audio file
        y, sr = librosa.load(audio_path, sr=None)

        # Extract simple features (can replace with ML model later)
        mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        avg_energy = np.mean(librosa.feature.rms(y=y))
        pitch = np.mean(librosa.yin(y, fmin=80, fmax=400))

        # Dummy rule-based sentiment (replace with real ML model later)
        if avg_energy > 0.05:
            sentiment = "confident"
        else:
            sentiment = "nervous"

        return {
            "sentiment": sentiment,
            "tone": "neutral",   # placeholder for now
            "energy": float(avg_energy),
            "pitch": float(pitch)
        }

    except Exception as e:
        return {"error": str(e)}

# -------------------------
# API Route
# -------------------------
@app.route("/analyze", methods=["POST"])
def analyze():
    if "audio" not in request.files:
        return jsonify({"error": "No audio file uploaded"}), 400

    file = request.files["audio"]

    # Save audio temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        file.save(tmp.name)
        result = analyze_voice(tmp.name)
        os.unlink(tmp.name)  # delete temp file

    return jsonify(result)

# -------------------------
# Run Server
# -------------------------
if __name__ == "__main__":
    app.run(debug=True)
