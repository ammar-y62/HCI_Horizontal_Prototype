import React, { useState, useRef, useEffect } from "react";
import { FaTrash, FaCaretRight, FaArrowLeft } from "react-icons/fa";
import "../assets/styles/Filter.css";
import { fetchPeople } from "../api/api";

const Filter = ({ onClose = () => {}, onFilterChange = () => {} }) => {
  const [subFilter, setSubFilter] = useState(null);
  const [people, setPeople] = useState([]);
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [selectedCaretakers, setSelectedCaretakers] = useState([]);
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
  const patients = people.filter(person => person.status === "patient");
  const caretakers = people.filter(person => person.status === "doctor");

  const handleCheckboxChange = (type, id) => {
    let newSelection;
    if (type === "patient") {
      newSelection = selectedPatients.includes(id)
        ? selectedPatients.filter(item => item !== id)
        : [...selectedPatients, id];
      setSelectedPatients(newSelection);
      onFilterChange({ patient: newSelection, doctor: selectedCaretakers });
    } else if (type === "caretaker") {
      newSelection = selectedCaretakers.includes(id)
        ? selectedCaretakers.filter(item => item !== id)
        : [...selectedCaretakers, id];
      setSelectedCaretakers(newSelection);
      onFilterChange({ patient: selectedPatients, doctor: newSelection });
    }
  };

  return (
    <div className="filter-popup" ref={filterRef}>
      <button
        className="filter-option"
        onClick={() => {
          // Clear all filters
          setSelectedPatients([]);
          setSelectedCaretakers([]);
          onFilterChange({ patient: [], doctor: [] });
          onClose();
        }}
      >
        <FaTrash /> Clear Filters
      </button>
      <button className="filter-option" onClick={() => setSubFilter("caretaker")}>
        By Caretaker <FaCaretRight />
      </button>
      <button className="filter-option" onClick={() => setSubFilter("patient")}>
        By Patient <FaCaretRight />
      </button>

      {subFilter && (
        <div className="sub-filter-popup">
          <button className="back-button" onClick={() => setSubFilter(null)}>
            <FaArrowLeft /> Back
          </button>
          {subFilter === "caretaker" ? (
            <>
              <h3 className="sub-filter-title">Filter By Caretaker</h3>
              <div className="person-list">
                {caretakers.map(caretaker => (
                  <label key={caretaker.id} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedCaretakers.includes(caretaker.id)}
                      onChange={() =>
                        handleCheckboxChange("caretaker", caretaker.id)
                      }
                    />{" "}
                    {caretaker.name}
                  </label>
                ))}
              </div>
            </>
          ) : (
            <>
              <h3 className="sub-filter-title">Filter By Patient</h3>
              <div className="person-list">
                {patients.map(patient => (
                  <label key={patient.id} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedPatients.includes(patient.id)}
                      onChange={() =>
                        handleCheckboxChange("patient", patient.id)
                      }
                    />{" "}
                    {patient.name}
                  </label>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Filter;
