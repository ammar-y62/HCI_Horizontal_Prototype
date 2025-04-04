import React, { useState, useEffect, useRef } from "react";
import { FaTimes, FaSearch } from "react-icons/fa";
import { fetchPeople, fetchAppointments, addAppointment } from "../api/api";
import "../assets/styles/Appointments.css";

// Patient details mock data
const patientDetailsMap = {
  "patient1": {
    name: "Patient 1",
    email: "example@example.com",
    phone: "403-123-4567",
    address: "123 Example Street"
  },
  "patient2": {
    name: "Patient 2",
    email: "patient2@example.com",
    phone: "403-234-5678",
    address: "456 Sample Avenue"
  },
  "patient3": {
    name: "Patient 3",
    email: "patient3@example.com",
    phone: "403-345-6789",
    address: "789 Test Boulevard"
  },
  "patient4": {
    name: "Patient 4",
    email: "patient4@example.com",
    phone: "403-456-7890",
    address: "101 Test Street"
  },
  "patient5": {
    name: "Patient 5",
    email: "patient5@example.com",
    phone: "403-567-8901",
    address: "202 Sample Road"
  },
  "patient6": {
    name: "Patient 6",
    email: "patient6@example.com",
    phone: "403-678-9012",
    address: "303 Example Avenue"
  },
  "patient7": {
    name: "Patient 7",
    email: "patient7@example.com",
    phone: "403-789-0123",
    address: "404 Test Drive"
  },
  "patient8": {
    name: "Patient 8",
    email: "patient8@example.com",
    phone: "403-890-1234",
    address: "505 Sample Lane"
  }
};

// Caretaker details mock data
const caretakerDetailsMap = {
  "caretaker1": {
    name: "Caretaker 1",
    position: "Doctor",
    email: "example@example.com",
    phone: "403-123-4567",
    address: "123 Example Street"
  },
  "caretaker2": {
    name: "Caretaker 2",
    position: "Nurse",
    email: "caretaker2@example.com",
    phone: "403-234-5678",
    address: "456 Sample Avenue"
  },
  "caretaker3": {
    name: "Caretaker 3",
    position: "Specialist",
    email: "caretaker3@example.com",
    phone: "403-345-6789",
    address: "789 Test Boulevard"
  },
  "caretaker4": {
    name: "Caretaker 4",
    position: "Doctor",
    email: "caretaker4@example.com",
    phone: "403-456-7890",
    address: "101 Example Road"
  },
  "caretaker5": {
    name: "Caretaker 5",
    position: "Nurse",
    email: "caretaker5@example.com",
    phone: "403-567-8901",
    address: "202 Test Street"
  },
  "caretaker6": {
    name: "Caretaker 6",
    position: "Specialist",
    email: "caretaker6@example.com",
    phone: "403-678-9012",
    address: "303 Sample Drive"
  }
};

const AppointmentPopup = ({ room, time, date, onClose, appointmentId, onAppointmentAdded }) => {
  // Added useRef for dropdown containers
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

  // Fetch people and appointments
  useEffect(() => {
    const loadPeople = async () => {
      try {
        const people = await fetchPeople();

        // Filter patients and caretakers, including their IDs
        const filteredPatients = people.filter(person => person.status === "patient")
          .map(person => ({ id: person.id, name: person.name }));

        const filteredCaretakers = people.filter(person => person.status === "doctor") // Keep filter as "doctor" for API compatibility
          .map(person => ({ id: person.id, name: person.name }));

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
          const appointments = await fetchAppointments();
          const appointment = appointments.find(a => a.id === appointmentId);
          if (appointment) {
            setSelectedPatient(appointment.patient_id);
            setSelectedCaretaker(appointment.doctor_id); // API uses doctor_id but UI shows caretaker
            setSelectedUrgency(appointment.urgency);
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
      if (patientDropdownRef.current && !patientDropdownRef.current.contains(event.target)) {
        // Delay hiding dropdown to allow click to register
        setTimeout(() => setShowPatientDropdown(false), 200);
      }
      if (caretakerDropdownRef.current && !caretakerDropdownRef.current.contains(event.target)) {
        // Delay hiding dropdown to allow click to register
        setTimeout(() => setShowCaretakerDropdown(false), 200);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get patient details - In a real app, this would fetch from API
  const getPatientDetails = (patientId) => {
    // Get details for the requested patient, or return a default if not found
    return patientDetailsMap[patientId] || {
      name: `Patient ${patientId.replace("patient", "")}`,
      email: "example@example.com",
      phone: "403-123-4567",
      address: "123 Example Street"
    };
  };

  // Get caretaker details - In a real app, this would fetch from API
  const getCaretakerDetails = (caretakerId) => {
    // Get details for the requested caretaker, or return a default if not found
    return caretakerDetailsMap[caretakerId] || {
      name: `Caretaker ${caretakerId.replace("caretaker", "")}`,
      position: "Doctor",
      email: "example@example.com",
      phone: "403-123-4567",
      address: "123 Example Street"
    };
  };

  // Filter patients based on search input
  const filteredPatients = patients.filter(patient => {
    const patientDisplayName = `Patient ${patients.findIndex(p => p.id === patient.id) + 1}`;
    return (
      patient.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
      patientDisplayName.toLowerCase().includes(patientSearch.toLowerCase())
    );
  });

  // Filter caretakers based on search input
  const filteredCaretakers = caretakers.filter(caretaker => {
    const caretakerDisplayName = `Caretaker ${caretakers.findIndex(c => c.id === caretaker.id) + 1}`;
    return (
      caretaker.name.toLowerCase().includes(caretakerSearch.toLowerCase()) ||
      caretakerDisplayName.toLowerCase().includes(caretakerSearch.toLowerCase())
    );
  });

  // Render patient details popup
  const renderPatientDetails = () => {
    if (!hoveredPatient) return null;
    
    const patientIndex = patients.findIndex(p => p.id === hoveredPatient);
    const patientNumber = patientIndex !== -1 ? patientIndex + 1 : 1;
    
    // Get patient details - In real app, this would use the actual patient ID
    const details = getPatientDetails(`patient${patientNumber}`);
    
    return (
      <div className="patient-details-popup">
        <div className="patient-details-header">
          Patient {patientNumber}
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
    
    const caretakerIndex = caretakers.findIndex(c => c.id === hoveredCaretaker);
    const caretakerNumber = caretakerIndex !== -1 ? caretakerIndex + 1 : 1;
    
    // Get caretaker details - In real app, this would use the actual caretaker ID
    const details = getCaretakerDetails(`caretaker${caretakerNumber}`);
    
    return (
      <div className="patient-details-popup">
        <div className="patient-details-header">
          Caretaker {caretakerNumber}
          <br />
          Profile
        </div>
        <div className="patient-details-content">
          <div className="patient-details-label">Name:</div>
          <div style={{ fontSize: "18px" }}>{details.name}</div>
          
          <div className="patient-details-label">Position:</div>
          <div style={{ fontSize: "18px" }}>{details.position}</div>
          
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
      // First make sure we have a valid date
      let formattedDate;
      if (date) {
        // Try to parse the date safely
        const dateObj = new Date(date);
        if (!isNaN(dateObj.getTime())) {
          // Valid date object, proceed as normal
          formattedDate = dateObj.toISOString().split('T')[0];  // Format as YYYY-MM-DD
        } else {
          // Invalid date, use current date instead
          console.warn("Invalid date provided, using today's date instead");
          formattedDate = new Date().toISOString().split('T')[0];
        }
      } else {
        // No date provided, use current date
        console.warn("No date provided, using today's date");
        formattedDate = new Date().toISOString().split('T')[0];
      }

      // Function to convert 12-hour AM/PM format to 24-hour format
      const convertTo24HourFormat = (time12hr) => {
        const [time, modifier] = time12hr.split(" ");  // Split time and AM/PM
        let [hours, minutes] = time.split(":");  // Split hours and minutes
        hours = parseInt(hours, 10); // Convert hours to number with radix 10

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

      const updatedAppointment = {
        room: room,
        date_time: formattedDateTime,  // Send formatted date_time
        patient: selectedPatient, // Send the patient ID
        doctor: selectedCaretaker, // API still uses doctor field
        urgency: selectedUrgency,
      };

      console.log("Saving appointment:", updatedAppointment);  // Log the request payload

      // Call API to save appointment
      await addAppointment(updatedAppointment);

      // Trigger refresh of the calendar events by calling the callback provided via props.
      if (onAppointmentAdded) {
        await onAppointmentAdded();
      }

      // Close the popup after saving
      onClose();
    } catch (error) {
      console.error("Error saving appointment:", error);
      alert("Failed to save appointment. Please try again.");
    }
  };

  // Clear form fields
  const handleClear = () => {
    setSelectedPatient("");
    setSelectedCaretaker("");
    setSelectedUrgency(1); // Reset to default urgency
  };

  return (
    <div className="popup-container">
      <div className="popup-box">
        <div className="popup-header" style={{ justifyContent: "center" }}>
          <span style={{ flexGrow: 1, textAlign: "center" }}>{`Room ${room} - ${time}`}</span>
          <FaTimes className="close-icon" onClick={onClose} style={{ position: "absolute", right: "15px", top: "15px" }} />
        </div>

        <div className="popup-section">
          <label style={{ textAlign: "center", width: "100%", display: "block" }}>Patient:</label>
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
            style={{ position: "relative", cursor: selectedPatient ? "pointer" : "default", textAlign: "center", display: "block", width: "100%", marginBottom: "15px" }}
          >
            {selectedPatient ? 
              patients.findIndex(p => p.id === selectedPatient) !== -1 ? 
                `Patient ${patients.findIndex(p => p.id === selectedPatient) + 1}` : 
                "Unassigned" : 
              "Unassigned"}
              
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
              style={{ display: 'block' }} // Force display
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
                  Patient {patients.findIndex(p => p.id === patient.id) + 1}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="popup-section">
          <label style={{ textAlign: "center", width: "100%", display: "block" }}>Caretaker:</label>
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
            style={{ position: "relative", cursor: selectedCaretaker ? "pointer" : "default", textAlign: "center", display: "block", width: "100%", marginBottom: "15px" }}
          >
            {selectedCaretaker ? 
              caretakers.findIndex(c => c.id === selectedCaretaker) !== -1 ? 
                `Caretaker ${caretakers.findIndex(c => c.id === selectedCaretaker) + 1}` : 
                "Unassigned" : 
              "Unassigned"}
              
            {showCaretakerDetails && hoveredCaretaker && renderCaretakerDetails()}
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
              style={{ display: 'block' }} // Force display
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
                  Caretaker {caretakers.findIndex(c => c.id === caretaker.id) + 1}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="popup-section" style={{ marginTop: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "10px" }}>
            <label style={{marginRight: "10px", fontSize: "22px", display: "inline-block"}}>Urgency:</label>
            <div 
              className={`urgency-box urgency-${selectedUrgency === 1 ? 'low' : selectedUrgency === 2 ? 'medium' : 'high'}`} 
              onClick={() => setShowUrgencySelector(!showUrgencySelector)}
              style={{ 
                backgroundColor: selectedUrgency === 1 ? '#4caf50' : selectedUrgency === 2 ? '#ffc107' : '#f44336',
                display: "inline-block",
                cursor: "pointer",
                border: "3px solid #000"
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
              ></div>
              <div 
                className="urgency-option urgency-medium" 
                onClick={() => {
                  setSelectedUrgency(2);
                  setShowUrgencySelector(false);
                }}
              ></div>
              <div 
                className="urgency-option urgency-high" 
                onClick={() => {
                  setSelectedUrgency(3);
                  setShowUrgencySelector(false);
                }}
              ></div>
            </div>
          )}
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