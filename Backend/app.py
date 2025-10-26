# app.py
from flask import Flask
from flask_cors import CORS
from routes.interview_routes import interview_bp
from model.interview_evaluator import InterviewEvaluator

app = Flask(__name__)
CORS(app)

# Initialize evaluator
evaluator = InterviewEvaluator()
interview_bp.evaluator = evaluator  # assign to blueprint

# Register blueprint
app.register_blueprint(interview_bp, url_prefix="/api/interview")

if __name__ == "__main__":
    app.run(debug=True)
