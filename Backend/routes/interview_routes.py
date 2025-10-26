# routes/interview_routes.py
from flask import Blueprint, request, jsonify

interview_bp = Blueprint("interview_bp", __name__)
evaluator = None  # will be assigned from app.py


@interview_bp.route("/start", methods=["POST"])
def start():
    try:
        data = request.get_json()
        domain = data.get("domain", "").strip().lower()
        specialization = data.get("subdomain", "").strip().lower()
        question_count = int(data.get("question_count", 5))

        questions = interview_bp.evaluator.load_questions(domain, specialization, question_count)
        if not questions:
            return jsonify({"error": f"No questions found for {specialization} in {domain}."}), 404

        return jsonify({"questions": [q["question"] for q in questions]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@interview_bp.route("/evaluate", methods=["POST"])
def evaluate():
    try:
        data = request.get_json()
        user_answers = data.get("answers", [])

        if not interview_bp.evaluator.questions:
            return jsonify({"error": "No questions loaded. Start interview first."}), 400

        if len(user_answers) != len(interview_bp.evaluator.questions):
            return jsonify({"error": f"Expected {len(interview_bp.evaluator.questions)} answers"}), 400

        result = interview_bp.evaluator.evaluate(user_answers)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
