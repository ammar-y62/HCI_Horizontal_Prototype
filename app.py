from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
# from flask_migrate import Migrate

app = Flask(__name__)
CORS(app)

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///clinic.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
# migrate = Migrate(app, db)
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
    urgency = db.Column(db.Integer, nullable=False, default=1)  # Add urgency field
    doctor = db.relationship('Person', foreign_keys=[doctor_id])
    patient = db.relationship('Person', foreign_keys=[patient_id])

with app.app_context():
    # Create the tables if they don't exist
    db.create_all()

    # Delete all records from the Person table to avoid uniqueness issues
    db.session.query(Person).delete()

    # Add hardcoded people (doctors, patients, caretakers) with unique emails
    doctor1 = Person(name="Dr. John Doe", email="johndoe@example.com", phone_number="1234567890", address="123 Medical St", status="doctor")
    doctor2 = Person(name="Dr. Jane Smith", email="janesmith@example.com", phone_number="0987654321", address="456 Health Rd", status="doctor")
    patient1 = Person(name="Patient A", email="patientA@example.com", phone_number="1112233445", address="789 Patient Ave", status="patient")
    patient2 = Person(name="Patient B", email="patientB@example.com", phone_number="5544332211", address="101 Patient Blvd", status="patient")
    caretaker1 = Person(name="Caretaker X", email="caretakerX@example.com", phone_number="2233445566", address="202 Caretaker St", status="caretaker")
    caretaker2 = Person(name="Caretaker Y", email="caretakerY@example.com", phone_number="6677889900", address="303 Caretaker Rd", status="caretaker")

    # Add the people to the session and commit
    db.session.add_all([doctor1, doctor2, patient1, patient2, caretaker1, caretaker2])
    db.session.commit()

    db.session.query(Appointment).delete()  # Clear existing appointments

    appointment1 = Appointment(room_number="1", date_time="2025-03-25 10:00", doctor_id=1, patient_id=3, urgency=1)
    appointment2 = Appointment(room_number="2", date_time="2025-03-25 11:00", doctor_id=2, patient_id=4, urgency=2)


    # Add the appointments to the session and commit
    db.session.add_all([appointment1, appointment2])
    db.session.commit()

    print("Hardcoded data has been added to the database.")


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
    # Check if the received data has the expected structure
    if not all(key in data for key in ['room', 'date_time', 'patient', 'doctor', 'urgency']):
        return jsonify({"message": "Missing fields in request"}), 400

    try:
        new_appointment = Appointment(
            room_number=data['room'],
            date_time=data['date_time'],  # Store the formatted date_time
            doctor_id=data['doctor'],  # Ensure doctor_id is being passed as well
            patient_id=data['patient'],
            urgency=data['urgency'],
        )
        db.session.add(new_appointment)
        db.session.commit()
        return jsonify({"message": "Appointment added successfully!"}), 201
    except Exception as e:
        print(f"Error adding appointment: {e}")
        return jsonify({"message": "Error saving appointment"}), 500

if __name__ == "__main__":
    app.run(debug=True)
