from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import IntegrityError
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

# ------------------- Config -------------------
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SECRET_KEY'] = 'supersecretkey'
app.config['JWT_SECRET_KEY'] = 'jwtsecretkey'

db = SQLAlchemy(app)
jwt = JWTManager(app)

# ------------------- User Model -------------------
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    email = db.Column(db.String(120), unique=True)
    password = db.Column(db.String(200))  # increase length for hashed password

with app.app_context():
    db.create_all()

# ------------------- Default Route -------------------
@app.route('/')
def home():
    return jsonify({'message': 'Flask backend is running!'})

# ------------------- Signup -------------------
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name, email, password = data['name'], data['email'], data['password']

    hashed_password = generate_password_hash(password)
    new_user = User(name=name, email=email, password=hashed_password)
    db.session.add(new_user)

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({'message': 'Email already exists'}), 400

    return jsonify({'message': 'Signup successful!'}), 200

# ------------------- Login -------------------
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email, password = data['email'], data['password']

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({'message': 'Invalid credentials'}), 401

    token = create_access_token(identity=email)
    return jsonify({'token': token, 'name': user.name}), 200

# ------------------- Favicon Route -------------------
@app.route('/favicon.ico')
def favicon():
    return '', 204  # prevent 404 in browser tab

if __name__ == '__main__':
    app.run(debug=True)
