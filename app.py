from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///clinic.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Define People Table
class Person(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone_number = db.Column(db.String(15), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    status = db.Column(db.String(20), nullable=False)  # "patient" or "caretaker"

# Define Appointments Table
class Appointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    room_number = db.Column(db.String(10), nullable=False)
    date_time = db.Column(db.String(50), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('person.id'), nullable=False)
    patient_id = db.Column(db.Integer, db.ForeignKey('person.id'), nullable=False)
    doctor = db.relationship('Person', foreign_keys=[doctor_id])
    patient = db.relationship('Person', foreign_keys=[patient_id])

# Create Tables
with app.app_context():
    db.create_all()

# API Endpoints
@app.route("/api/people", methods=["GET"])
def get_people():
    people = Person.query.all()
    return jsonify([{ "id": p.id, "name": p.name, "email": p.email, "phone_number": p.phone_number, "address": p.address, "status": p.status } for p in people])

@app.route("/api/people", methods=["POST"])
def add_person():
    data = request.json
    new_person = Person(
        name=data['name'],
        email=data['email'],
        phone_number=data['phone_number'],
        address=data['address'],
        status=data['status']
    )
    db.session.add(new_person)
    db.session.commit()
    return jsonify({"message": "Person added successfully!"}), 201

@app.route("/api/appointments", methods=["GET"])
def get_appointments():
    appointments = Appointment.query.all()
    return jsonify([{ "id": a.id, "room_number": a.room_number, "date_time": a.date_time, "doctor_id": a.doctor_id, "patient_id": a.patient_id } for a in appointments])

@app.route("/api/appointments", methods=["POST"])
def add_appointment():
    data = request.json
    new_appointment = Appointment(
        room_number=data['room_number'],
        date_time=data['date_time'],
        doctor_id=data['doctor_id'],
        patient_id=data['patient_id']
    )
    db.session.add(new_appointment)
    db.session.commit()
    return jsonify({"message": "Appointment added successfully!"}), 201

if __name__ == "__main__":
    app.run(debug=True)
