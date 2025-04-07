import React, { useState, useRef, useEffect } from "react";
import { FaTimes, FaArrowLeft, FaUser, FaList, FaPlus, FaSearch } from "react-icons/fa";
import "../assets/styles/Profiles.css"; // Separate styling for Profiles



const Profiles = ({ onClose = () => {} }) => {
  const [view, setView] = useState("main");
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(""); // Store the patient ID, not name
  const [selectedDoctor, setselectedDoctor] = useState(""); // Store the doctor ID, not name
  const profilesRef = useRef(null);

  
  // Close profiles when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profilesRef.current && !profilesRef.current.contains(event.target)) {
        setView("main"); // Reset view to main before closing
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="profiles-popup" ref={profilesRef}>
      {view === "main" && (
        <div className="profiles-main">
          <button className="close-button" onClick={onClose}><FaTimes /></button>
          <h3>Profile Management</h3>
          <div className="center-container">
            <button className="profile-option center-button" onClick={() => setView("patients")}>
              <FaUser /> Patients
            </button>
            <hr />
            <button className="profile-option center-button" onClick={() => setView("caretakers")}>
              <FaUser /> Caretakers
            </button>
          </div>
        </div>
      )}

      {view === "patients" && (
        <div className="profiles-sub">
          <button className="back-button" onClick={() => setView("main")}><FaArrowLeft /> </button>
          <h3>Patients</h3>
          <button className="profile-action wide-button"><FaList /> View</button>
          <hr />
          <button className="profile-action wide-button"><FaPlus /> Add</button>
        </div>
      )}

      {view === "caretakers" && (
        <div className="profiles-sub">
          <button className="back-button" onClick={() => setView("main")}><FaArrowLeft /> </button>
          <h3>Caretakers</h3>
          <button className="profile-action wide-button" onClick={() => setView("view-caretakers")}><FaList /> View</button>
          <hr />
          <button className="profile-action wide-button" onClick={() => setView("add-caretakers")}><FaPlus /> Add</button>
        </div>
      )}

      {view === "view-caretakers" && (
        <div className="profiles-sub">
          <button className="back-button" onClick={() => setView("caretakers")}><FaArrowLeft /> </button>
          <h3>View Caretaker Profile</h3>
          <div className="dropdown-full">
            <FaSearch />
            <select className="dropdown-box"
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)} // Set ID instead of name
            >
              <option value="">Select Patient</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}></option>
                ))}
              </select>
          </div>
        </div>
      )}
            {view === "add-caretakers" && (
        <div className="profiles-sub">
          <button className="back-button" onClick={() => setView("caretakers")}><FaArrowLeft /> </button>
          <h3>Add Caretaker Profile</h3>
          
        </div>
      )}
    </div>
  );
};

export default Profiles;