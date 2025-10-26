from flask import Flask, request, jsonify, render_template, session
from werkzeug.utils import secure_filename
import os
import numpy as np
from utils import predict_emotions
import google.generativeai as genai

# ==========================
# CONFIG
# ==========================
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.secret_key = "supersecretkey"  # for session

# Configure Gemini API key
genai.configure(api_key="AIzaSyB-QhYS03iyBN2AjYnfQxCaqkbR4CkvvAI")

# ==========================
# ROUTE: HOME
# ==========================
@app.route("/")
def index():
    session.clear()
    return render_template("index.html")

# ==========================
# ROUTE: START INTERVIEW
# ==========================
@app.route("/start_interview", methods=["POST"])
def start_interview():
    domain = request.form.get("domain")
    specialization = request.form.get("specialization")
    skills = request.form.get("skills", "")
    experience = request.form.get("experience", "")
    num_questions = int(request.form.get("num_questions", 5))

    session["domain"] = domain
    session["specialization"] = specialization
    session["skills"] = skills
    session["experience"] = experience
    session["num_questions"] = num_questions
    session["current_index"] = 0
    session["questions"] = []
    session["answers"] = []

    # Generate all questions
    prompt = (
        f"You are an interviewer for {domain} - {specialization}. "
        f"The candidate has {experience} years experience and skills in {skills}. "
        f"Ask {num_questions} technical interview questions. "
        f"Return questions line by line."
    )
    model = genai.GenerativeModel("models/gemini-2.5-flash")
    response = model.generate_content(prompt)

# Clean Gemini output
    lines = [line.strip() for line in response.text.split("\n") if line.strip()]
    questions = []

    for line in lines:
    # Skip any lines that sound like an intro or instructions
        if line.lower().startswith("here are") or line.lower().startswith("these are"):
            continue
        if line[0].isdigit() and "." in line:
        # Remove numbering like "1." or "2."
            line = line.split(".", 1)[1].strip()
        questions.append(line)

# If Gemini didn't provide enough questions, ensure non-empty
    if not questions:
        questions = ["What is React?", "What are the advantages of using Tailwind CSS?"]

    session["questions"] = questions

    # Return first question
    first_question = questions[0]
    return render_template("interview.html", question=first_question)

# ==========================
# ROUTE: NEXT QUESTION
# ==========================
@app.route("/next_question", methods=["POST"])
def next_question():
    if "current_index" not in session:
        return jsonify({"error": "Session expired"}), 400

    audio = request.files.get("audio_data")
    if audio:
        filename = secure_filename(audio.filename)
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        audio.save(filepath)

        # Predict emotion
        emotion, probs = predict_emotions(filepath)
        if isinstance(emotion, (list, np.ndarray)):
            emotion = emotion[0]
        probs = {k: float(v) for k, v in probs.items()}

        session["answers"].append({"filepath": filepath, "emotion": emotion, "probs": probs})

    # Move to next question
    session["current_index"] += 1
    idx = session["current_index"]
    questions = session.get("questions", [])

    if idx >= len(questions):
        return jsonify({"done": True})

    return jsonify({"done": False, "question": questions[idx]})

# ==========================
# ROUTE: FINAL FEEDBACK
# ==========================
@app.route("/final_feedback", methods=["GET"])
def final_feedback():
    answers = session.get("answers", [])
    domain = session.get("domain", "")
    specialization = session.get("specialization", "")

    if not answers:
        return jsonify({"error": "No answers found"}), 400

    # Convert answers and detected emotions to text for the AI
    answers_text = "\n".join([
        f"Question {i+1}: Candidate sounded {a['emotion']}"
        for i, a in enumerate(answers)
    ])

    # Create short emotion summaries for frontend
    answers_summary = []
    for i, a in enumerate(answers):
        emotion = a["emotion"]
        if emotion == "confident":
            desc = "Candidate sounded confident and composed."
        elif emotion == "nervous":
            desc = "Candidate appeared nervous or hesitant."
        elif emotion == "stressed":
            desc = "Candidate sounded stressed, affecting clarity."
        else:
            desc = "Candidate’s emotional state was neutral or unclear."
        answers_summary.append({
            "question": i + 1,
            "emotion": emotion,
            "description": desc
        })

    # AI feedback prompt
    prompt = (
        f"You are an expert interviewer for a {domain} - {specialization} role.\n"
        f"The candidate answered with these emotional states:\n\n"
        f"{answers_text}\n\n"
        f"Generate a detailed professional feedback report covering:\n"
        f"- Overall Impression\n"
        f"- Strengths\n"
        f"- Weaknesses\n"
        f"- Tips for Improvement\n"
        f"- Suggestions on Overall Communication\n\n"
        f"Do NOT include interviewer name or candidate ID. Format as a clean report."
    )

    model = genai.GenerativeModel("models/gemini-2.5-flash")
    response = model.generate_content(prompt)
    final_feedback_text = response.text.strip()

    # Return both final feedback and emotion summary
    return jsonify({
        "final_feedback": final_feedback_text,
        "answers_summary": answers_summary
    })



# ==========================
# ROUTE: RESULT PAGE
# ==========================
@app.route("/result")
def result():
    return render_template("result.html")

# ==========================
# MAIN
# ==========================
if __name__ == "__main__":
    app.run(debug=True)
