// src/components/AppointmentPopup.js
import React from "react";
import "../assets/styles/Appointments.css";
import { FaTimes, FaSearch } from "react-icons/fa";

const AppointmentPopup = ({ room, time, onClose }) => {
  return (
    <div className="popup-container">
      <div className="popup-box">
        <div className="popup-header">
          <span>{`Room ${room} - ${time}`}</span>
          <FaTimes className="close-icon" onClick={onClose} />
        </div>

        <div className="popup-section">
          <label>Patient:</label>
          <span>Unassigned</span>
          <div className="input-with-icon">
            <FaSearch />
            <select>
              <option>Patient 1</option>
              <option>Patient 2</option>
              <option>Patient 3</option>
            </select>
          </div>
        </div>

        <div className="popup-section">
          <label>Caretaker:</label>
          <span>Unassigned</span>
          <div className="input-with-icon">
            <FaSearch />
            <select>
              <option>Caretaker 1</option>
              <option>Caretaker 2</option>
              <option>Caretaker 3</option>
            </select>
          </div>
        </div>

        <div className="popup-section">
          <label>Urgency:</label>
          <div className="urgency-box" />
        </div>

        <div className="popup-buttons">
          <button className="clear-btn">Clear</button>
          <button className="save-btn">Save</button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentPopup;
