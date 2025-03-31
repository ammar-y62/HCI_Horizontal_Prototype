import React, { useState, useEffect } from "react";
import "../assets/styles/Appointments.css";
import { FaTimes, FaSearch } from "react-icons/fa";
import { fetchPeople, fetchAppointments } from "../api/api"; // Fetching data from API
import { addAppointment } from "../api/api";

const AppointmentPopup = ({ room, time, date, onClose, appointmentId, onAppointmentAdded  }) => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(""); // Store the patient ID, not name
  const [selectedDoctor, setselectedDoctor] = useState(""); // Store the doctor ID, not name
  const [selectedUrgency, setSelectedUrgency] = useState(1); // Default urgency to 1

  // Fetch people and appointments
  useEffect(() => {
    const loadPeople = async () => {
      try {
        const people = await fetchPeople();

        // Filter patients and doctors, including their IDs
        const filteredPatients = people.filter(person => person.status === "patient")
          .map(person => ({ id: person.id, name: person.name }));

        const filteredDoctors = people.filter(person => person.status === "doctor")
          .map(person => ({ id: person.id, name: person.name }));

        setPatients(filteredPatients);
        setDoctors(filteredDoctors);
      } catch (error) {
        console.error("Error fetching people:", error);
      }
    };

    loadPeople();
  }, []);

  // Fetch the appointment details if editing an existing appointment
  useEffect(() => {
    const loadAppointmentDetails = async () => {
      if (appointmentId) {
        try {
          const appointments = await fetchAppointments();
          const appointment = appointments.find(a => a.id === appointmentId);
          if (appointment) {
            setSelectedPatient(appointment.patient_id); // Use patient ID here
            setselectedDoctor(appointment.doctor_id); // Use doctor ID here
            setSelectedUrgency(appointment.urgency);
          }
        } catch (error) {
          console.error("Error fetching appointment:", error);
        }
      }
    };

    loadAppointmentDetails();
  }, [appointmentId]);

// Save the updated appointment
const handleSave = async () => {
  // Extract only the date part from the Date object (no time)
  const formattedDate = new Date(date).toISOString().split('T')[0];  // Format as YYYY-MM-DD

  // Function to convert 12-hour AM/PM format to 24-hour format
  const convertTo24HourFormat = (time12hr) => {
    const [time, modifier] = time12hr.split(" ");  // Split time and AM/PM
    let [hours, minutes] = time.split(":");  // Split hours and minutes
    hours = parseInt(hours); // Convert hours to number

    if (modifier === "PM" && hours !== 12) {
      hours += 12;  // Convert PM time to 24-hour format
    } else if (modifier === "AM" && hours === 12) {
      hours = 0;  // Convert 12 AM to 00:00
    }

    return `${hours.toString().padStart(2, '0')}:${minutes}`;  // Return formatted time
  };

  // Convert the time to 24-hour format
  const formattedTime = convertTo24HourFormat(time);
  const formattedDateTime = `${formattedDate} ${formattedTime}`;

  // Extract just the room number from the "Room X" format (e.g., "Room 5" -> "5")
  const updatedAppointment = {
    room: room,
    date_time: formattedDateTime,  // Send formatted date_time
    patient: selectedPatient, // Send the patient ID
    doctor: selectedDoctor, // Send the doctor ID
    urgency: selectedUrgency,
  };

  console.log(updatedAppointment);  // Log the request payload

  // Call API to save appointment
  try {
    await addAppointment(updatedAppointment);

    // Trigger refresh of the calendar events by calling the callback provided via props.
    if (onAppointmentAdded) {
      await onAppointmentAdded();
    }

    // Close the popup after saving
    onClose();
  } catch (error) {
    console.error("Error saving appointment:", error);
  }
};

  // Clear form fields
  const handleClear = () => {
    setSelectedPatient("");
    setselectedDoctor("");
    setSelectedUrgency(1); // Reset to default urgency
  };

  return (
    <div className="popup-container">
      <div className="popup-box">
        <div className="popup-header">
          <span>{`Room ${room} - ${time}`}</span>
          <FaTimes className="close-icon" onClick={onClose} />
        </div>

        <div className="popup-section">
          <label>Patient:</label>
          <span>{selectedPatient ? patients.find(patient => patient.id === selectedPatient)?.name : "Unassigned"}</span>
          <div className="input-with-icon">
            <FaSearch />
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)} // Set ID instead of name
            >
              <option value="">Select Patient</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="popup-section">
          <label>Doctor:</label>
          <span>{selectedDoctor ? doctors.find(doctor => doctor.id === selectedDoctor)?.name : "Unassigned"}</span>
          <div className="input-with-icon">
            <FaSearch />
            <select
              value={selectedDoctor}
              onChange={(e) => setselectedDoctor(e.target.value)} // Set ID instead of name
            >
              <option value="">Select Doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="popup-section">
          <label>Urgency:</label>
          <div className="urgency-box">
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(Number(e.target.value))}
            >
              <option value={1} className="urgency-low">1 (Least)</option>
              <option value={2} className="urgency-medium">2</option>
              <option value={3} className="urgency-high">3 (Most)</option>
            </select>
          </div>
        </div>

        <div className="popup-buttons">
          <button className="clear-btn" onClick={handleClear}>Clear</button>
          <button className="save-btn" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentPopup;
