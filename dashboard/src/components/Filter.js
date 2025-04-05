import React, { useState, useRef, useEffect } from "react";
import { FaTrash, FaCaretRight, FaArrowLeft } from "react-icons/fa";
import "../assets/styles/Filter.css"; // Separate styling for Filter

const Filter = ({ onClose = () => {} }) => {  // Ensure onClose is always a function
  const [subFilter, setSubFilter] = useState(null);
  const filterRef = useRef(null);

  // Close filter when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setSubFilter(null); // Close sub-filter first
        onClose(); // Then close main filter
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="filter-popup" ref={filterRef}>
      <button className="filter-option" onClick={onClose}>
        <FaTrash /> Clear Filters
      </button>
      <button className="filter-option" 
      onClick={() => setSubFilter("caretaker")}
      >By Caretaker <FaCaretRight /></button>
      <button className="filter-option" 
      onClick={() => setSubFilter("patient")}
      >By Patient <FaCaretRight /></button>

      {subFilter && (
        <div className="sub-filter-popup">
          <button className="back-button" onClick={() => setSubFilter(null)}><FaArrowLeft /> Back</button>
          {subFilter === "caretaker" ? (
            <>
              <h3 className="sub-filter-title">Filter By Caretaker</h3>
              <div className="filter-search"><input type="text" placeholder="Search..." /></div>
              <div className="person-list">
                <label className="checkbox-label"><input type="checkbox" /> Caretaker 1</label>
                <label className="checkbox-label"><input type="checkbox" /> Caretaker 2</label>
              </div>
            </>
          ) : (
            <>
              <h3 className="sub-filter-title">Filter By Patient</h3>
              <div className="filter-search"><input type="text" placeholder="Search..." /></div>
              <div className="person-list">
                <label className="checkbox-label"><input type="checkbox" /> Patient 1</label>
                <label className="checkbox-label"><input type="checkbox" /> Patient 2</label>
                <label className="checkbox-label"><input type="checkbox" /> Patient 3</label>
                <label className="checkbox-label"><input type="checkbox" /> Patient 1</label>
                <label className="checkbox-label"><input type="checkbox" /> Patient 2</label>
                <label className="checkbox-label"><input type="checkbox" /> Patient 3</label>
                <label className="checkbox-label"><input type="checkbox" /> Patient 1</label>
                <label className="checkbox-label"><input type="checkbox" /> Patient 2</label>
                <label className="checkbox-label"><input type="checkbox" /> Patient 3</label>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Filter;
