import base64
import io
import speech_recognition as sr

def audio_to_text(audio_dataurl):
    """
    Convert base64 audio from frontend to text using Google Speech Recognition.
    """
    try:
        header, encoded = audio_dataurl.split(",", 1)
        audio_bytes = base64.b64decode(encoded)
        with io.BytesIO(audio_bytes) as audio_file:
            r = sr.Recognizer()
            with sr.AudioFile(audio_file) as source:
                audio = r.record(source)
                return r.recognize_google(audio)
    except Exception as e:
        print("Audio to text error:", e)
        return ""
