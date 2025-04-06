import React, { useState, useRef, useEffect } from "react";
import {
  FaTrash,
  FaCaretRight,
  FaArrowLeft,
  FaSearch,
  FaUserNurse,
  FaUser,
} from "react-icons/fa";
import "../assets/styles/Filter.css";
import { fetchPeople } from "../api/api";

const Filter = ({ onClose = () => {}, onFilterChange = () => {} }) => {
  const [subFilter, setSubFilter] = useState(null);
  const [people, setPeople] = useState([]);

  // Track which IDs are selected
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [selectedCaretakers, setSelectedCaretakers] = useState([]);

  // Separate search states for caretakers vs. patients
  const [caretakerSearch, setCaretakerSearch] = useState("");
  const [patientSearch, setPatientSearch] = useState("");

  const filterRef = useRef(null);

  // Fetch people on mount
  useEffect(() => {
    const loadPeople = async () => {
      try {
        const peopleData = await fetchPeople();
        setPeople(peopleData);
      } catch (error) {
        console.error("Error fetching people:", error);
      }
    };
    loadPeople();
  }, []);

  // Close filter when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setSubFilter(null);
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Separate people by status
  const patients = people.filter((person) => person.status === "patient");
  const caretakers = people.filter((person) => person.status === "doctor");

  // Filter lists by the search term
  const filteredCaretakers = caretakers.filter((c) =>
    c.name.toLowerCase().includes(caretakerSearch.toLowerCase())
  );
  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(patientSearch.toLowerCase())
  );

  // Handle checkbox toggles
  const handleCheckboxChange = (type, id) => {
    let newSelection;
    if (type === "patient") {
      newSelection = selectedPatients.includes(id)
        ? selectedPatients.filter((item) => item !== id)
        : [...selectedPatients, id];
      setSelectedPatients(newSelection);
      onFilterChange({ patient: newSelection, doctor: selectedCaretakers });
    } else if (type === "caretaker") {
      newSelection = selectedCaretakers.includes(id)
        ? selectedCaretakers.filter((item) => item !== id)
        : [...selectedCaretakers, id];
      setSelectedCaretakers(newSelection);
      onFilterChange({ patient: selectedPatients, doctor: newSelection });
    }
  };

  return (
    <div className="filter-popup" ref={filterRef}>
      {/* ---- Main Buttons ---- */}
      <button
        className="filter-option"
        onClick={() => {
          // Clear all filters
          setSelectedPatients([]);
          setSelectedCaretakers([]);
          setCaretakerSearch("");
          setPatientSearch("");
          onFilterChange({ patient: [], doctor: [] });
          onClose();
        }}
      >
        <FaTrash className="icon-left" />
        <span className="button-text">Clear Filters</span>
      </button>

      <button className="filter-option" onClick={() => setSubFilter("caretaker")}>
        <FaUserNurse className="icon-left" />
        <span className="button-text">By Caretaker</span>
        <FaCaretRight className="icon-right" />
      </button>

      <button className="filter-option" onClick={() => setSubFilter("patient")}>
        <FaUser className="icon-left" />
        <span className="button-text">By Patient</span>
        <FaCaretRight className="icon-right" />
      </button>

      {/* ---- Sub‐Filter Popup ---- */}
      {subFilter && (
        <div
          className="sub-filter-popup"
          style={{
            border: "2px solid #7a8aff",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            background: "#fff",
            padding: "12px",
            minWidth: "200px",
            zIndex: 300,
            position: "absolute",
            top: 0,
            left: "100%",
            transform: "translateX(8px)",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {/* Header: Back button and Title */}
          <div className="sub-header">
            <button className="back-button" onClick={() => setSubFilter(null)}>
              <FaArrowLeft />
            </button>
            <h3 className="sub-filter-title" style={{ margin: 0 }}>
              {subFilter === "caretaker" ? "Filter By Caretaker" : "Filter By Patient"}
            </h3>
          </div>

          {/* Search Bar */}
          <div
            className="filter-search"
            style={{ position: "relative", marginBottom: "8px" }}
          >
            <FaSearch
              className="search-icon"
              style={{
                position: "absolute",
                left: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#999",
              }}
            />
            <input
              type="text"
              placeholder={
                subFilter === "caretaker"
                  ? "Search caretaker..."
                  : "Search patient..."
              }
              value={subFilter === "caretaker" ? caretakerSearch : patientSearch}
              onChange={(e) =>
                subFilter === "caretaker"
                  ? setCaretakerSearch(e.target.value)
                  : setPatientSearch(e.target.value)
              }
              style={{
                width: "100%",
                padding: "6px 8px 6px 28px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            />
          </div>

          {/* List of People */}
          <div
            className="person-list"
            style={{ maxHeight: "120px", overflowY: "auto" }}
          >
            {subFilter === "caretaker"
              ? filteredCaretakers.map((caretaker) => (
                  <label
                    key={caretaker.id}
                    className="checkbox-label"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "6px 0",
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                  >
                    <span>{caretaker.name}</span>
                    <input
                      type="checkbox"
                      checked={selectedCaretakers.includes(caretaker.id)}
                      onChange={() =>
                        handleCheckboxChange("caretaker", caretaker.id)
                      }
                    />
                  </label>
                ))
              : filteredPatients.map((patient) => (
                  <label
                    key={patient.id}
                    className="checkbox-label"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "6px 0",
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                  >
                    <span>{patient.name}</span>
                    <input
                      type="checkbox"
                      checked={selectedPatients.includes(patient.id)}
                      onChange={() => handleCheckboxChange("patient", patient.id)}
                    />
                  </label>
                ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Filter;
