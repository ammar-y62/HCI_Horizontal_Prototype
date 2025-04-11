import React, { useState, useEffect, useRef } from "react";
import { FaTimes, FaSearch, FaRegSave } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
import { FaRegTrashCan } from "react-icons/fa6";
import {
  fetchPeople,
  fetchAppointments,
  addAppointment,
  deleteAppointment,
  updateAppointment,
  fetchAppointmentById,
} from "../api/api";
import "../assets/styles/Appointments.css";

// Patient details mock data
const patientDetailsMap = {
  patient1: {
    name: "Patient 1",
    email: "example@example.com",
    phone: "403-123-4567",
    address: "123 Example Street",
  },
};

// Caretaker details mock data
const caretakerDetailsMap = {
  caretaker1: {
    name: "Caretaker 1",
    email: "example@example.com",
    phone: "403-123-4567",
    address: "123 Example Street",
  },
};

const AppointmentPopup = ({
  room,
  time,
  date,
  onClose,
  appointmentId,
  onAppointmentAdded,
}) => {
  const patientDropdownRef = useRef(null);
  const caretakerDropdownRef = useRef(null);

  const [patients, setPatients] = useState([]);
  const [caretakers, setCaretakers] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedCaretaker, setSelectedCaretaker] = useState("");
  const [selectedUrgency, setSelectedUrgency] = useState(1); // Default urgency to 1 (Low)
  const [showUrgencySelector, setShowUrgencySelector] = useState(false);
  const [patientSearch, setPatientSearch] = useState("");
  const [caretakerSearch, setCaretakerSearch] = useState("");
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [showCaretakerDropdown, setShowCaretakerDropdown] = useState(false);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [hoveredPatient, setHoveredPatient] = useState(null);
  const [showCaretakerDetails, setShowCaretakerDetails] = useState(false);
  const [hoveredCaretaker, setHoveredCaretaker] = useState(null);
  const [notes, setNotes] = useState(""); // New state for notes
  // Fetch people (patients and caretakers) when component mounts
  useEffect(() => {
    const loadPeople = async () => {
      try {
        const people = await fetchPeople();
        // Filter patients
        const filteredPatients = people
          .filter((person) => person.status === "patient")
          .map((person) => ({
            id: person.id,
            name: person.name,
            email: person.email,
            phone_number: person.phone_number,
            address: person.address,
          }));

        // Filter caretakers - include all non-patients
        const filteredCaretakers = people
          .filter((person) => person.status !== "patient")
          .map((person) => ({
            id: person.id,
            name: person.name,
            email: person.email,
            phone_number: person.phone_number,
            address: person.address,
          }));

        setPatients(filteredPatients);
        setCaretakers(filteredCaretakers);
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
          // Directly fetch the appointment by ID
          const appointment = await fetchAppointmentById(appointmentId);

          // Fall back to finding it in the list
          if (!appointment || Object.keys(appointment).length === 0) {
            const appointments = await fetchAppointments();
            const foundAppointment = appointments.find(
              (a) => a.id === appointmentId
            );
            console.log("Fetched appointment:", appointment); // Debugging

            if (foundAppointment) {
              // Set patient, caretaker, and urgency
              setSelectedPatient(foundAppointment.patient_id);
              setSelectedCaretaker(foundAppointment.doctor_id);
              setSelectedUrgency(foundAppointment.urgency || 1);
              setNotes(foundAppointment.notes || ""); // Set the notes field
            } else {
              console.warn("Appointment not found with ID:", appointmentId);
            }
          } else {
            // Set patient, caretaker, and urgency
            setSelectedPatient(appointment.patient_id);
            setSelectedCaretaker(appointment.doctor_id);
            setSelectedUrgency(appointment.urgency || 1);
            setNotes(appointment.notes || ""); // Set the notes field
          }
        } catch (error) {
          console.error("Error fetching appointment:", error);
        }
      }
    };

    loadAppointmentDetails();
  }, [appointmentId]);

  // Add click outside listener to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        patientDropdownRef.current &&
        !patientDropdownRef.current.contains(event.target)
      ) {
        // Delay hiding dropdown to allow click to register
        setTimeout(() => setShowPatientDropdown(false), 200);
      }
      if (
        caretakerDropdownRef.current &&
        !caretakerDropdownRef.current.contains(event.target)
      ) {
        // Delay hiding dropdown to allow click to register
        setTimeout(() => setShowCaretakerDropdown(false), 200);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get patient details
  const getPatientDetails = (patientId) => {
    // If the patientId is one of the loaded patients, use their name
    const patient = patients.find((p) => p.id === patientId);

    // Get details for the requested patient, or return a default if not found
    return (
      patientDetailsMap[patientId] || {
        name: patient
          ? patient.name
          : `Patient ${patientId.replace("patient", "")}`,
        email: patient.email,
        phone: patient.phone_number,
        address: patient.address,
      }
    );
  };

  // Get caretaker details
  const getCaretakerDetails = (caretakerId) => {
    // If the caretakerId is one of the loaded caretakers, use their name
    const caretaker = caretakers.find((c) => c.id === caretakerId);

    // Get details for the requested caretaker, or return a default if not found
    return (
      caretakerDetailsMap[caretakerId] || {
        name: caretaker
          ? caretaker.name
          : `Caretaker ${caretakerId.replace("caretaker", "")}`,
        email: caretaker.email,
        phone: caretaker.phone_number,
        address: caretaker.address,
      }
    );
  };

  // Filter patients based on search input
  const filteredPatients = patients.filter((patient) => {
    return patient.name.toLowerCase().includes(patientSearch.toLowerCase());
  });

  // Filter caretakers based on search input
  const filteredCaretakers = caretakers.filter((caretaker) => {
    return caretaker.name.toLowerCase().includes(caretakerSearch.toLowerCase());
  });

  // Render patient details popup
  const renderPatientDetails = () => {
    if (!hoveredPatient) return null;

    const patient = patients.find((p) => p.id === hoveredPatient);
    if (!patient) return null;

    // Get patient details - In real app, this would use the actual patient ID
    const details = getPatientDetails(patient.id);

    return (
      <div className="patient-details-popup">
        <div className="patient-details-header">
          {patient.name}
          <br />
          Profile
        </div>
        <div className="patient-details-content">
          <div className="patient-details-label">Name:</div>
          <div style={{ fontSize: "18px" }}>{details.name}</div>

          <div className="patient-details-label">Email:</div>
          <div style={{ fontSize: "18px" }}>{details.email}</div>

          <div className="patient-details-label">Phone:</div>
          <div style={{ fontSize: "18px" }}>{details.phone}</div>

          <div className="patient-details-label">Address:</div>
          <div style={{ fontSize: "18px" }}>{details.address}</div>
        </div>
      </div>
    );
  };

  // Render caretaker details popup
  const renderCaretakerDetails = () => {
    if (!hoveredCaretaker) return null;

    const caretaker = caretakers.find((c) => c.id === hoveredCaretaker);
    if (!caretaker) return null;

    // Get caretaker details
    const details = getCaretakerDetails(caretaker.id);

    return (
      <div className="patient-details-popup">
        <div className="patient-details-header">
          {caretaker.name}
          <br />
          Profile
        </div>
        <div className="patient-details-content">
          <div className="patient-details-label">Name:</div>
          <div style={{ fontSize: "18px" }}>{details.name}</div>

          <div className="patient-details-label">Email:</div>
          <div style={{ fontSize: "18px" }}>{details.email}</div>

          <div className="patient-details-label">Phone:</div>
          <div style={{ fontSize: "18px" }}>{details.phone}</div>

          <div className="patient-details-label">Address:</div>
          <div style={{ fontSize: "18px" }}>{details.address}</div>
        </div>
      </div>
    );
  };

  // Save the updated appointment
  const handleSave = async () => {
    try {
      // Use the date passed from the calendar
      let formattedDate;

      if (date instanceof Date) {
        // If it's already a Date object, use it directly
        formattedDate = date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
      } else if (typeof date === "string" && date.includes("T")) {
        // Handle ISO string format
        formattedDate = new Date(date).toISOString().split("T")[0];
      } else {
        // No valid date provided, use current date as fallback
        console.warn("No valid date provided, using today's date");
        formattedDate = new Date().toISOString().split("T")[0];
      }

      // Function to convert 12-hour AM/PM format to 24-hour format
      const convertTo24HourFormat = (time12hr) => {
        const [time, modifier] = time12hr.split(" "); // Split time and AM/PM
        let [hours, minutes] = time.split(":"); // Split hours and minutes
        hours = parseInt(hours, 10); // Convert hours to number with radix 10

        if (modifier === "PM" && hours !== 12) {
          hours += 12; // Convert PM time to 24-hour format
        } else if (modifier === "AM" && hours === 12) {
          hours = 0; // Convert 12 AM to 00:00
        }

        return `${hours.toString().padStart(2, "0")}:${minutes}`; // Return formatted time
      };

      // Convert the time to 24-hour format
      const formattedTime = convertTo24HourFormat(time);
      const formattedDateTime = `${formattedDate} ${formattedTime}`;

      // Make sure room is a number
      const roomNumber = parseInt(room, 10);

      const appointmentData = {
        room_number: roomNumber,
        date_time: formattedDateTime,
        patient_id: selectedPatient,
        doctor_id: selectedCaretaker,
        urgency: selectedUrgency,
        notes: notes,
      };

      try {
        if (appointmentId) {
          // Update existing appointment
          const response = await updateAppointment(
            appointmentId,
            appointmentData
          );
        } else {
          // Create new appointment
          const response = await addAppointment(appointmentData);
        }

        // Trigger refresh of the calendar events
        if (onAppointmentAdded) {
          await onAppointmentAdded();
        }

        // Close the popup after saving
        onClose();
      } catch (apiError) {
        console.error("API Error:", apiError);
        console.error("API Error details:", apiError.message);
        alert(
          `Failed to save appointment: ${apiError.message}. Please check console for details.`
        );
      }
    } catch (error) {
      console.error("Error in handleSave function:", error);
      alert("Failed to save appointment. Please try again.");
    }
  };

  // Clear form fields
  const handleClear = () => {
    setSelectedPatient("");
    setSelectedCaretaker("");
    setSelectedUrgency(1); // Reset to default urgency
  };

  // Delete the appointment
  const handleDelete = async () => {
    if (!appointmentId) return;

    try {
      // Confirm before deleting
      if (window.confirm("Are you sure you want to delete this appointment?")) {
        await deleteAppointment(appointmentId);

        // Refresh events
        if (onAppointmentAdded) {
          await onAppointmentAdded();
        }

        // Close the popup
        onClose();
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      alert("Failed to delete appointment. Please try again.");
    }
  };

  return (
    <div className="popup-container">
      <div className="popup-box">
        <div className="popup-header" style={{ justifyContent: "center" }}>
          <span
            style={{ flexGrow: 1, textAlign: "center" }}
          >{`Room ${room} - ${time}`}</span>
          <FaTimes
            className="close-icon"
            onClick={onClose}
            style={{ position: "absolute", right: "15px", top: "15px" }}
          />
        </div>

        <div className="popup-section">
          <label
            style={{ textAlign: "center", width: "100%", display: "block" }}
          >
            Patient:
          </label>
          <span
            onMouseEnter={() => {
              if (selectedPatient) {
                setHoveredPatient(selectedPatient);
                setShowPatientDetails(true);
              }
            }}
            onMouseLeave={() => {
              setShowPatientDetails(false);
              setHoveredPatient(null);
            }}
            style={{
              position: "relative",
              cursor: selectedPatient ? "pointer" : "default",
              textAlign: "center",
              display: "block",
              width: "100%",
              marginBottom: "15px",
            }}
          >
            {selectedPatient
              ? (() => {
                  const patient = patients.find(
                    (p) => p.id === selectedPatient
                  );
                  return patient ? patient.name : "Unassigned";
                })()
              : "Unassigned"}

            {showPatientDetails && hoveredPatient && renderPatientDetails()}
          </span>
          <div className="input-with-icon">
            <div className="search-icon">
              <FaSearch />
            </div>
            <input
              className="search-input"
              type="text"
              value={patientSearch}
              onChange={(e) => {
                setPatientSearch(e.target.value);
                setShowPatientDropdown(true);
              }}
              onClick={() => setShowPatientDropdown(true)}
              placeholder="Search patient..."
            />
          </div>
          {showPatientDropdown && filteredPatients.length > 0 && (
            <div
              className="dropdown-display"
              ref={patientDropdownRef}
              style={{
                display: "block",
                maxHeight: "160px", // Fits about 4 items
                overflowY: "auto", // Always show scrollbar capability
                overscrollBehavior: "contain", // Prevents scroll chaining
                overflowX: "hidden", // Prevent horizontal scrolling
              }}
            >
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="dropdown-item"
                  onClick={() => {
                    setSelectedPatient(patient.id);
                    setPatientSearch("");
                    setShowPatientDropdown(false);
                  }}
                  onMouseEnter={() => {
                    setHoveredPatient(patient.id);
                    setShowPatientDetails(true);
                  }}
                  onMouseLeave={() => {
                    setShowPatientDetails(false);
                    setHoveredPatient(null);
                  }}
                >
                  {patient.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="popup-section">
          <label
            style={{ textAlign: "center", width: "100%", display: "block" }}
          >
            Caretaker:
          </label>
          <span
            onMouseEnter={() => {
              if (selectedCaretaker) {
                setHoveredCaretaker(selectedCaretaker);
                setShowCaretakerDetails(true);
              }
            }}
            onMouseLeave={() => {
              setShowCaretakerDetails(false);
              setHoveredCaretaker(null);
            }}
            style={{
              position: "relative",
              cursor: selectedCaretaker ? "pointer" : "default",
              textAlign: "center",
              display: "block",
              width: "100%",
              marginBottom: "15px",
            }}
          >
            {selectedCaretaker
              ? (() => {
                  const caretaker = caretakers.find(
                    (c) => c.id === selectedCaretaker
                  );
                  return caretaker ? caretaker.name : "Unassigned";
                })()
              : "Unassigned"}

            {showCaretakerDetails &&
              hoveredCaretaker &&
              renderCaretakerDetails()}
          </span>
          <div className="input-with-icon">
            <div className="search-icon">
              <FaSearch />
            </div>
            <input
              className="search-input"
              type="text"
              value={caretakerSearch}
              onChange={(e) => {
                setCaretakerSearch(e.target.value);
                setShowCaretakerDropdown(true);
              }}
              onClick={() => setShowCaretakerDropdown(true)}
              placeholder="Search caretaker..."
            />
          </div>
          {showCaretakerDropdown && filteredCaretakers.length > 0 && (
            <div
              className="dropdown-display"
              ref={caretakerDropdownRef}
              style={{
                display: "block",
                maxHeight: "160px", // Fits about 4 items
                overflowY: "auto", // Always show scrollbar capability
                overscrollBehavior: "contain", // Prevents scroll chaining
                overflowX: "hidden", // Prevent horizontal scrolling
              }}
            >
              {filteredCaretakers.map((caretaker) => (
                <div
                  key={caretaker.id}
                  className="dropdown-item"
                  onClick={() => {
                    setSelectedCaretaker(caretaker.id);
                    setCaretakerSearch("");
                    setShowCaretakerDropdown(false);
                  }}
                  onMouseEnter={() => {
                    setHoveredCaretaker(caretaker.id);
                    setShowCaretakerDetails(true);
                  }}
                  onMouseLeave={() => {
                    setShowCaretakerDetails(false);
                    setHoveredCaretaker(null);
                  }}
                >
                  {caretaker.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="popup-section" style={{ marginTop: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <label
              style={{
                marginRight: "10px",
                fontSize: "22px",
                display: "inline-block",
              }}
            >
              Urgency:
            </label>
            <div
              className={`urgency-box urgency-${
                selectedUrgency === 1
                  ? "low"
                  : selectedUrgency === 2
                  ? "medium"
                  : "high"
              }`}
              onClick={() => setShowUrgencySelector(!showUrgencySelector)}
              style={{
                backgroundColor:
                  selectedUrgency === 1
                    ? "#4caf50"
                    : selectedUrgency === 2
                    ? "#ffc107"
                    : "#f44336",
                display: "inline-block",
                cursor: "pointer",
                border: "3px solid #000",
              }}
            ></div>
          </div>
          {showUrgencySelector && (
            <div className="urgency-selector">
              <div
                className="urgency-option urgency-low"
                onClick={() => {
                  setSelectedUrgency(1);
                  setShowUrgencySelector(false);
                }}
                title="Low" // Added title
              ></div>
              <div
                className="urgency-option urgency-medium"
                onClick={() => {
                  setSelectedUrgency(2);
                  setShowUrgencySelector(false);
                }}
                title="Medium" // Added title
              ></div>
              <div
                className="urgency-option urgency-high"
                onClick={() => {
                  setSelectedUrgency(3);
                  setShowUrgencySelector(false);
                }}
                title="High" // Added title
              ></div>
            </div>
          )}
        </div>
        <div className="popup-section">
          <label
            style={{ textAlign: "center", width: "100%", display: "block" }}
          >
            Notes:
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes here..."
            style={{
              width: "90%",
              height: "50px",
              border: "2px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              fontSize: "16px",
              resize: "none",
            }}
          ></textarea>
        </div>
        <div className="popup-buttons" style={{ flexDirection: "row" }}>
          <button className="clear-btn" onClick={handleClear}>
            <ImCancelCircle />
            Clear
          </button>
          <button
            className="save-btn"
            onClick={handleSave}
            disabled={!selectedPatient || !selectedCaretaker}
            style={{
              backgroundColor:
                !selectedPatient || !selectedCaretaker ? "#a9b7d0" : "#4F81BD",
              cursor:
                !selectedPatient || !selectedCaretaker
                  ? "not-allowed"
                  : "pointer",
              opacity: !selectedPatient || !selectedCaretaker ? 0.7 : 1,
            }}
          >
            <FaRegSave />
            Save
          </button>
        </div>

        {appointmentId && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <button className="delete-btn" onClick={handleDelete}>
              <FaRegTrashCan />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentPopup;
