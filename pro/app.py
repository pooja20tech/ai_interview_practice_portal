from flask import Flask, flash, request, jsonify, render_template, session, redirect, url_for
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
import os
import numpy as np
from utils import predict_emotions  # should return: emotion, probs, score
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

# In-memory user storage (for demo)
users = {}

# --------------------------
# ROUTE: SIGNUP
# --------------------------
@app.route("/auth", methods=["GET","POST"])
def auth():
    if request.method == "POST":
        # Distinguish form by which fields exist
        if "full_name" in request.form:  # signup form
            full_name = request.form.get("full_name")
            email = request.form.get("email")
            password = request.form.get("password")
            confirm_password = request.form.get("confirm_password")

            if password != confirm_password:
                return {"status": "error", "message": "Passwords do not match!"}

            if email in users:
                return {"status": "error", "message": "Email already registered!"}

            users[email] = {"full_name": full_name, "password_hash": generate_password_hash(password)}
            return {"status": "success", "message": "Signup successful! Please login."}

        else:  # login form
            email = request.form.get("email")
            password = request.form.get("password")
            user = users.get(email)

            if user and check_password_hash(user["password_hash"], password):
                session["user_email"] = email
                session["user_name"] = user["full_name"]
                return {"status": "success", "message": "Login successful!"}
            else:
                return {"status": "error", "message": "Invalid credentials!"}

    # GET request
    mode = request.args.get("mode", "signup")
    return render_template("auth.html", mode=mode)


# --------------------------
# ROUTE: LANDING PAGE
# --------------------------
@app.route("/")
def index():
    session.clear()
    return render_template("landingPage.html")

# --------------------------
# ROUTE: DASHBOARD
# --------------------------
@app.route("/dashboard")
def dashboard():
    if "user_email" not in session:
        return redirect(url_for("auth", mode="login"))
    return render_template("dashboard.html", name=session["user_name"])


# --------------------------
# ROUTE: INTERVIEW DETAIL
# --------------------------
@app.route("/interviewDetail")
def interview_detail():
    return render_template("interviewDetail.html")

# --------------------------
# ROUTE: START INTERVIEW
# --------------------------
@app.route("/start_interview", methods=["POST"])
def start_interview():
    domain = request.form.get("domain")
    specialization = request.form.get("specialization")
    skills = request.form.get("skills", "")
    experience = request.form.get("experience", "")
    num_questions = int(request.form.get("num_questions", 5))

    # Initialize session
    session.update({
        "domain": domain,
        "specialization": specialization,
        "skills": skills,
        "experience": experience,
        "num_questions": num_questions,
        "current_index": 0,
        "questions": [],
        "answers": []
    })

    # Refined prompt for Gemini
    prompt = (
        f"You are a friendly interviewer for a {domain} - {specialization} role. "
        f"The candidate has {experience} years of experience and skills in {skills}. "
        f"Ask {num_questions} easy, verbal-only technical questions suitable for their experience level. "
        f"Do NOT ask questions that require writing code, drawing diagrams, or performing calculations. "
        f"Focus only on conceptual understanding and verbal explanation. "
        f"Return each question line by line without numbering or greetings. "
        f"Do NOT include any welcome message, introductions, or extra text."
    )

    model = genai.GenerativeModel("models/gemini-2.5-flash")
    response = model.generate_content(prompt)

    # Clean Gemini output
    lines = [line.strip() for line in response.text.split("\n") if line.strip()]
    questions = []
    for line in lines:
        # Skip any remaining intro lines
        if line.lower().startswith(("here are", "these are", "alright", "let's start")):
            continue
        # Remove numbering like "1."
        if line[0].isdigit() and "." in line:
            line = line.split(".", 1)[1].strip()
        questions.append(line)

    # Fallback if Gemini fails
    if not questions:
        questions = [
            "What is React?",
            "Explain the difference between SQL and NoSQL databases.",
            "What are the advantages of using Tailwind CSS?",
            "What is an API and why is it important?",
            "Explain the concept of responsive design."
        ][:num_questions]

    session["questions"] = questions

    # Return first question directly (no greetings)
    return render_template("interview.html", question=questions[0], total_questions=len(questions))


# --------------------------
# ROUTE: NEXT QUESTION
# --------------------------
@app.route("/next_question", methods=["POST"])
def next_question():
    if "current_index" not in session:
        return jsonify({"error": "Session expired"}), 400

    audio = request.files.get("audio_data")
    idx = session["current_index"]
    emotion_summary = None

    if audio:
        filename = secure_filename(audio.filename)
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        audio.save(filepath)

        # Predict emotion and score
        emotion, probs, score = predict_emotions(filepath)

        session.setdefault("answers", []).append({
            "question_index": idx + 1,
            "filepath": filepath,
            "emotion": emotion,
            "probs": probs,
            "score": score
        })

        # Description mapping
        desc_map = {
            "confident": "Candidate sounded confident and composed.",
            "nervous": "Candidate appeared nervous or hesitant.",
            "stressed": "Candidate sounded stressed.",
            "angry": "Candidate sounded frustrated or angry.",
            "sad": "Candidate appeared sad or disappointed.",
            "confused": "Candidate seemed confused or unsure."
        }
        desc = desc_map.get(emotion, "Candidate’s emotional state was neutral.")
        emotion_summary = {"question": idx + 1, "emotion": emotion, "description": desc, "score": score}

    # Move to next question
    session["current_index"] += 1
    questions = session.get("questions", [])

    if session["current_index"] >= len(questions):
        return jsonify({"done": True, "emotion_summary": emotion_summary})

    return jsonify({
        "done": False,
        "question": questions[session["current_index"]],
        "q_number": session["current_index"] + 1,
        "emotion_summary": emotion_summary
    })


# --------------------------
# ROUTE: FINAL FEEDBACK
# --------------------------
@app.route("/final_feedback", methods=["GET"])
def final_feedback():
    answers = session.get("answers", [])
    domain = session.get("domain", "")
    specialization = session.get("specialization", "")
    if not answers:
        return jsonify({"error": "No answers found"}), 400

    desc_map = {
        "confident": "Candidate sounded confident and composed.",
        "nervous": "Candidate appeared nervous or hesitant.",
        "stressed": "Candidate sounded stressed, affecting clarity.",
        "angry": "Candidate sounded frustrated or angry.",
        "sad": "Candidate appeared sad or disappointed.",
        "confused": "Candidate seemed confused or unsure."
    }

    # Prepare summary for result page
    summary = []
    answers_text = ""
    for i, a in enumerate(answers):
        desc = desc_map.get(a["emotion"], "Candidate’s emotional state was neutral or unclear.")
        summary.append({
            "question": i + 1,
            "emotion": a["emotion"],
            "description": desc,
            "score": a["score"]
        })
        answers_text += f"Question {i+1}: Candidate sounded {a['emotion']}\n"

    # Generate AI feedback
    prompt = (
        f"You are an expert interviewer for a {domain} - {specialization} role.\n"
        f"The candidate answered with these emotional states:\n\n"
        f"{answers_text}\n\n"
        f"Generate a detailed professional feedback report covering:\n"
        f"- Overall Impression\n"
        f"- Strengths\n"
        f"- Weaknesses\n"
        f"- Tips for Improvement\n"
        f"- Suggestions on Overall Communication\n"
        f"Format as a clean report."
    )
    model = genai.GenerativeModel("models/gemini-2.5-flash")
    response = model.generate_content(prompt)
    final_feedback_text = response.text.strip()

    return jsonify({"final_feedback": final_feedback_text, "answers_summary": summary})

# --------------------------
# ROUTE: RESULT PAGE
# --------------------------
@app.route("/result")
def result():
    return render_template("result.html")  # frontend JS should use /final_feedback to plot chart

# --------------------------
# MAIN
# --------------------------
if __name__ == "__main__":
    app.run(debug=True)
