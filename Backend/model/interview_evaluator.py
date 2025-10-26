# model/interview_evaluator.py
from sentence_transformers import SentenceTransformer, util
from transformers import pipeline

# Dummy questions DB
QUESTION_DB = {
    "frontend": {
        "easy": [
            {"question": "What is HTML?", "ideal": "HTML stands for HyperText Markup Language used to structure web pages."},
            {"question": "What does CSS do?", "ideal": "CSS styles the appearance of HTML elements."},
        ],
        "medium": [
            {"question": "Explain the difference between class and functional components in React.", "ideal": "Class components use ES6 classes and lifecycle methods, while functional components use hooks like useState and useEffect."}
        ]
    },
    "backend": {
        "easy": [
            {"question": "What is a REST API?", "ideal": "A REST API uses HTTP methods to interact with resources represented in JSON or XML."},
            {"question": "What is Flask?", "ideal": "Flask is a lightweight Python web framework for building APIs and web apps."},
        ]
    }
}


class InterviewEvaluator:
    def __init__(self):
        print("Loading models... this may take a moment...", flush=True)
        self.similarity_model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
        self.feedback_generator = pipeline(
            "text2text-generation",
            model="google/flan-t5-small",
            device=-1
        )
        print("Models loaded successfully!", flush=True)
        self.questions = []

    def load_questions(self, domain, specialization, count=5):
        all_questions = QUESTION_DB.get(domain, {}).get(specialization, [])
        self.questions = all_questions[:count]
        return self.questions

    def evaluate(self, user_answers):
        results = []
        total_score = 0

        for i, data in enumerate(self.questions):
            user_answer = user_answers[i]
            ideal_answer = data["ideal"]

            sim = util.cos_sim(
                self.similarity_model.encode(user_answer, convert_to_tensor=True),
                self.similarity_model.encode(ideal_answer, convert_to_tensor=True)
            ).item()

            score = round(min(max(sim * 12, 3), 10), 2)
            total_score += score

            feedback_prompt = f"""
            Candidate answer: '{user_answer}'
            Ideal answer: '{ideal_answer}'
            Evaluate based on clarity, confidence, grammar, and completeness.
            Provide concise improvement suggestions.
            """
            feedback = self.feedback_generator(feedback_prompt, max_new_tokens=100, do_sample=False)[0]['generated_text']

            results.append({
                "question": data['question'],
                "answer": user_answer,
                "score": score,
                "feedback": feedback,
                "ideal": ideal_answer
            })

        avg_score = round(total_score / len(self.questions), 2)
        overall_prompt = f"The candidate's average score is {avg_score}. Give overall feedback on speaking, confidence, and content quality."
        overall_feedback = self.feedback_generator(overall_prompt, max_new_tokens=100, do_sample=False)[0]['generated_text']

        return {
            "results": results,
            "overall_score": avg_score,
            "overall_feedback": overall_feedback
        }
