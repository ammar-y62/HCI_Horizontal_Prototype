import React, { useState, useRef, useEffect } from "react";
import { FaTimes, FaArrowLeft, FaUser, FaList, FaPlus } from "react-icons/fa";
import "../assets/styles/Profiles.css"; // Separate styling for Profiles

const Profiles = ({ onClose = () => {} }) => {
  const [view, setView] = useState("main");
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
          <button className="profile-option" onClick={() => setView("patients")}>
            <FaUser /> Patients
          </button>
          <hr />
          <button className="profile-option" onClick={() => setView("caretakers")}>
            <FaUser /> Caretakers
          </button>
        </div>
      )}

      {view === "patients" && (
        <div className="profiles-sub">
          <button className="back-button" onClick={() => setView("main")}><FaArrowLeft /> Back</button>
          <h3>Patients</h3>
          <button className="profile-action"><FaList /> View</button>
          <hr />
          <button className="profile-action"><FaPlus /> Add</button>
        </div>
      )}

      {view === "caretakers" && (
        <div className="profiles-sub">
          <button className="back-button" onClick={() => setView("main")}><FaArrowLeft /> Back</button>
          <h3>Caretakers</h3>
          <button className="profile-action"><FaList /> View</button>
          <hr />
          <button className="profile-action"><FaPlus /> Add</button>
        </div>
      )}
    </div>
  );
};

export default Profiles;