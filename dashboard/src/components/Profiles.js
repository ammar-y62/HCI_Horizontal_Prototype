import React, { useState, useRef, useEffect } from "react";
import { FaTimes, FaArrowLeft, FaUser, FaList, FaPlus } from "react-icons/fa";
import "../assets/styles/Profiles.css"; // Separate styling for Profiles

const Dropdown = ({ info = [], placeholder_text = "Search...", onSelect}) => {
  const [people, setPeople] = useState("");
  const [showPeople, setShowPeople] = useState(false);

  const show_data = info.filter((item) =>
  item.toLowerCase().includes(people.toLowerCase()))

  const handleSelect = (item) => {
    onSelect(item);
    showPeople(false);
    setShowPeople("");
  };
// TODO: make the dropdown for the view patients/caretaker
  return (
    <div className = "dropdown-container">
      <div className = "search-box">

      </div>
    </div>
  )
}

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
          <button className="profile-option center-button" onClick={() => setView("patients")}>
            <FaUser /> Patients
          </button>
          <hr />
          <button className="profile-option center-button" onClick={() => setView("caretakers")}>
            <FaUser /> Caretakers
          </button>
        </div>
      )}

      {view === "patients" && (
        <div className="profiles-sub">
          <button className="back-button" onClick={() => setView("main")}><FaArrowLeft /> Back</button>
          <h3>Patients</h3>
          <button className="profile-action wide-button"><FaList /> View</button>
          <hr />
          <button className="profile-action wide-button"><FaPlus /> Add</button>
        </div>
      )}

      {view === "caretakers" && (
        <div className="profiles-sub">
          <button className="back-button" onClick={() => setView("main")}><FaArrowLeft /> Back</button>
          <h3>Caretakers</h3>
          <button className="profile-action wide-button"  onClick={() => setView("view-caretakers")}><FaList /> View</button>
          <hr />
          <button className="profile-action wide-button" onClick={() => setView("add-caretakers")}><FaPlus /> Add</button>
        </div>
      )}

      {view === "view-caretakers" && (
        <div className="profiles-sub">
          <button className="back-button" onClick={() => setView("main")}><FaArrowLeft /> Back</button>
          <h3>View Caretaker Profile</h3>
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
      )}
            {view === "add-caretakers" && (
        <div className="profiles-sub">
          <button className="back-button" onClick={() => setView("main")}><FaArrowLeft /> Back</button>
          <h3>Add Caretaker Profile</h3>
          
        </div>
      )}
    </div>
  );
};

export default Profiles;