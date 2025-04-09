import React, { useState, useRef, useEffect } from "react";
import {
  FaTimes,
  FaArrowLeft,
  FaUser,
  FaList,
  FaPlus,
  FaSearch,
  FaUserEdit,
  FaUserNurse,
} from "react-icons/fa";
import "../assets/styles/Profiles.css"; // Separate styling for Profiles
import { updatePerson, deletePerson, addPerson, fetchPeople } from "../api/api";

const Profiles = ({ onClose = () => {} }) => {
  const [view, setView] = useState("main");
  const [newPatient, setNewPatient] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(""); // Store the patient ID, not name
  const [selectedCaretaker, setSelectedCaretaker] = useState(""); // Store the doctor ID, not name
  const profilesRef = useRef(null);
  const patientDropdownRef = useRef(null);

  const [patientSearch, setPatientSearch] = useState("");
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);

  const [caretakerSearch, setCaretakerSearch] = useState("");
  const [showCaretakerDropdown, setShowCaretakerDropdown] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editedPatientInfo, setEditedPatientInfo] = useState({});
  const [editedCaretakerInfo, setEditedCaretakerInfo] = useState({});
  const [editingPatientField, setEditingPatientField] = useState("");
  const [editingCaretakerField, setEditingCaretakerField] = useState("");
  const [patientList, setPatientList] = useState([]);
  const [caretakerList, setCaretakerList] = useState([]);
  const [patientDetailsMap, setPatientDetailsMap] = useState({});
  const [caretakerDetailsMap, setCaretakerDetailsMap] = useState({});

  // Fetch people from the backend and separate them into patients and caretakers
  useEffect(() => {
    const loadPeople = async () => {
      try {
        const peopleData = await fetchPeople();
        const patients = peopleData.filter(
          (person) => person.status === "patient"
        );
        //TODO: Doctor or caretaker?
        const caretakers = peopleData.filter(
          (person) =>
            person.status === "doctor" || person.status === "caretaker"
        );

        setPatientList(patients.map((p) => ({ id: p.id, name: p.name })));
        setCaretakerList(caretakers.map((c) => ({ id: c.id, name: c.name })));

        const patientDetails = {};
        patients.forEach((p) => {
          patientDetails[p.id] = {
            id: p.id, // Ensure the ID is included
            name: p.name,
            email: p.email,
            phone: p.phone_number,
            address: p.address,
          };
        });
        setPatientDetailsMap(patientDetails);

        const caretakerDetails = {};
        caretakers.forEach((c) => {
          caretakerDetails[c.id] = {
            id: c.id,
            name: c.name,
            email: c.email,
            phone: c.phone_number,
            address: c.address,
          };
        });
        setCaretakerDetailsMap(caretakerDetails);
      } catch (error) {
        console.error("Error fetching people:", error);
      }
    };

    loadPeople();
  }, []);

  const [newCaretaker, setNewCaretaker] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Filter based on search input
  const filteredPatients = patientList.filter((p) =>
    p.name.toLowerCase().includes(patientSearch.toLowerCase())
  );

  const filteredCaretakers = caretakerList.filter((p) =>
    p.name.toLowerCase().includes(caretakerSearch.toLowerCase())
  );

  const hasPatientChanges = () => {
    const original = patientDetailsMap[selectedPatient];
    return JSON.stringify(original) !== JSON.stringify(editedPatientInfo);
  };

  const hasCaretakerChanges = () => {
    const original = caretakerDetailsMap[selectedCaretaker];
    return JSON.stringify(original) !== JSON.stringify(editedCaretakerInfo);
  };

  const patientHasEmptyInput = (patient) => {
    return (
      !String(patient.name || "").trim() ||
      !String(patient.email || "").trim() ||
      !String(patient.phone || "").trim() ||
      !String(patient.address || "").trim()
    );
  };

  const patientHasInvalidInput = (patient) => {
    return (
      patientHasEmptyInput(patient) || !isPhoneNumberFormatted(patient.phone)
    );
  };

  const caretakerHasEmptyInput = (caretaker) => {
    return (
      !String(caretaker.name || "").trim() ||
      !String(caretaker.email || "").trim() ||
      !String(caretaker.phone || "").trim() ||
      !String(caretaker.address || "").trim()
    );
  };

  const caretakerHasInvalidInput = (caretaker) => {
    return (
      caretakerHasEmptyInput(caretaker) ||
      !isPhoneNumberFormatted(caretaker.phone)
    );
  };

  const isPhoneNumberFormatted = (phone) => {
    return /^\d{3}-\d{3}-\d{4}$/.test(phone);
  };

  const formatPhoneNumber = (value) => {
    // Remove non-digit characters
    const digits = value.replace(/\D/g, "").slice(0, 10);

    // Format into xxx-xxx-xxxx
    const part1 = digits.slice(0, 3);
    const part2 = digits.slice(3, 6);
    const part3 = digits.slice(6, 10);

    if (digits.length <= 3) return part1;
    if (digits.length <= 6) return `${part1}-${part2}`;
    return `${part1}-${part2}-${part3}`;
  };

  // Delete a patient
  const handleDeletePatient = async (patientId) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        await deletePerson(patientId); // Call the API to delete the patient
        setPatientList(patientList.filter((p) => p.id !== patientId)); // Update the state
        const updatedMap = { ...patientDetailsMap };
        delete updatedMap[patientId];
        setPatientDetailsMap(updatedMap);
        alert("Patient deleted successfully!");
      } catch (error) {
        console.error("Error deleting patient:", error);
        alert("Failed to delete patient. Please try again.");
      }
    }
  };

  // Delete a caretaker
  const handleDeleteCaretaker = async (caretakerId) => {
    if (window.confirm("Are you sure you want to delete this caretaker?")) {
      try {
        await deletePerson(caretakerId); // Call the API to delete the caretaker
        setCaretakerList(caretakerList.filter((c) => c.id !== caretakerId)); // Update the state
        const updatedMap = { ...caretakerDetailsMap };
        delete updatedMap[caretakerId];
        setCaretakerDetailsMap(updatedMap);
        alert("Caretaker deleted successfully!");
      } catch (error) {
        console.error("Error deleting caretaker:", error);
        alert("Failed to delete caretaker. Please try again.");
      }
    }
  };

  // Close profiles when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profilesRef.current && !profilesRef.current.contains(event.target)) {
        setView("main"); // Reset view to main before closing
        onClose();
      }
      if (
        patientDropdownRef.current &&
        !patientDropdownRef.current.contains(event.target)
      ) {
        setTimeout(() => setShowPatientDropdown(false), 50);
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
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
          <h3>Profile Management</h3>
          <div className="center-container">
            <button
              className="profile-option center-button"
              onClick={() => setView("patients")}
            >
              <FaUser /> Patients
            </button>
            <hr />
            <button
              className="profile-option center-button"
              onClick={() => setView("caretakers")}
            >
              <FaUserNurse /> Caretakers
            </button>
          </div>
        </div>
      )}

      {view === "patients" && (
        <div className="profiles-sub">
          <button className="back-button" onClick={() => setView("main")}>
            <FaArrowLeft />{" "}
          </button>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
          <h3>Patients</h3>
          <button
            className="profile-action wide-button"
            onClick={() => setView("view-patients")}
          >
            <FaList /> View
          </button>
          <hr />
          <button
            className="profile-action wide-button"
            onClick={() => setView("add-patients")}
          >
            <FaPlus /> Add
          </button>
        </div>
      )}

      {view === "view-patients" && (
        <div className="profiles-sub">
          <button className="back-button" onClick={() => setView("patients")}>
            <FaArrowLeft />
          </button>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
          <h3>View Patient Profiles</h3>

          <div
            className="dropdown-full"
            ref={patientDropdownRef}
            style={{ flexDirection: "column" }}
          >
            <input
              type="text"
              className="dropdown-box"
              placeholder="Search Patient by Name"
              value={patientSearch}
              onChange={(e) => {
                setPatientSearch(e.target.value);
                setShowPatientDropdown(true);
              }}
              onClick={() => setShowPatientDropdown(true)}
            />
            <FaSearch className="dropdown-icon" />

            {showPatientDropdown && filteredPatients.length > 0 && (
              <div className="dropdown-menu">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="dropdown-item"
                    onClick={() => {
                      setSelectedPatient(patient.id);
                      setPatientSearch(patient.name);
                      setShowPatientDropdown(false);
                      setView("view-patient-profile");
                      setEditedPatientInfo(patientDetailsMap[patient.id]);
                      setIsEditing(false);
                    }}
                  >
                    {patient.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {view === "view-patient-profile" && selectedPatient && (
        <div className="profiles-info-sub">
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
          <button
            className="back-button"
            onClick={() => setView("view-patients")}
          >
            <FaArrowLeft />
          </button>
          <h3>
            {patientDetailsMap[selectedPatient]?.name}
            <br />
            Profile
          </h3>

          <div className="profile-info-row">
            <strong>Name:</strong>
            {editingPatientField === "name" ? (
              <input
                value={editedPatientInfo.name}
                onChange={(e) =>
                  setEditedPatientInfo({
                    ...editedPatientInfo,
                    name: e.target.value,
                  })
                }
                className="edit-box"
              />
            ) : (
              <span className="profile-text">{editedPatientInfo.name}</span>
            )}
            <FaUserEdit
              className="edit-icon"
              onClick={() => {
                setEditingPatientField(
                  editingPatientField === "name" ? "" : "name"
                );
              }}
            />
          </div>

          <hr className="profile-hr" />
          <div className="profile-info-row">
            <strong>Email:</strong>
            {editingPatientField === "email" ? (
              <input
                value={editedPatientInfo.email}
                onChange={(e) =>
                  setEditedPatientInfo({
                    ...editedPatientInfo,
                    email: e.target.value,
                  })
                }
                className="edit-box"
              />
            ) : (
              <span className="profile-text">{editedPatientInfo.email}</span>
            )}
            <FaUserEdit
              className="edit-icon"
              onClick={() => {
                setEditingPatientField(
                  editingPatientField === "email" ? "" : "email"
                );
              }}
            />
          </div>

          <hr className="profile-hr" />
          <div className="profile-info-row">
            <strong>Phone:</strong>
            {editingPatientField === "phone" ? (
              <input
                placeholder="Enter phone number"
                value={editedPatientInfo.phone}
                onChange={(e) => {
                  const formattedValue = formatPhoneNumber(e.target.value);
                  setEditedPatientInfo({
                    ...editedPatientInfo,
                    phone: formattedValue,
                  });
                }}
                className="edit-box"
              />
            ) : (
              <span className="profile-text">{editedPatientInfo.phone}</span>
            )}
            <FaUserEdit
              className="edit-icon"
              onClick={() => {
                setEditingPatientField(
                  editingPatientField === "phone" ? "" : "phone"
                );
              }}
            />
          </div>

          <hr className="profile-hr" />
          <div className="profile-info-row">
            <strong>Address:</strong>
            {editingPatientField === "address" ? (
              <input
                value={editedPatientInfo.address}
                onChange={(e) =>
                  setEditedPatientInfo({
                    ...editedPatientInfo,
                    address: e.target.value,
                  })
                }
                className="edit-box"
              />
            ) : (
              <span className="profile-text">{editedPatientInfo.address}</span>
            )}
            <FaUserEdit
              className="edit-icon"
              onClick={() => {
                setEditingPatientField(
                  editingPatientField === "address" ? "" : "address"
                );
              }}
            />
          </div>

          <div className="popup-buttons">
            <button
              className="remove-btn"
              onClick={() =>
                handleDeletePatient(patientDetailsMap[selectedPatient].id)
              }
            >
              Remove
            </button>

            <button
              className="save-profile-btn"
              disabled={
                !hasPatientChanges() ||
                patientHasInvalidInput(editedPatientInfo)
              }
              style={{
                opacity:
                  hasPatientChanges() &&
                  !patientHasInvalidInput(editedPatientInfo)
                    ? 1
                    : 0.5,
                cursor:
                  hasPatientChanges() &&
                  !patientHasInvalidInput(editedPatientInfo)
                    ? "pointer"
                    : "not-allowed",
              }}
              onClick={async () => {
                try {
                  // Call the updatePerson API with the edited patient data
                  await updatePerson(selectedPatient, {
                    name: editedPatientInfo.name,
                    email: editedPatientInfo.email,
                    phone_number: editedPatientInfo.phone,
                    address: editedPatientInfo.address,
                  });

                  // Update the local state with the edited data
                  setPatientDetailsMap({
                    ...patientDetailsMap,
                    [selectedPatient]: { ...editedPatientInfo },
                  });

                  setPatientList(
                    patientList.map((p) =>
                      p.id === selectedPatient
                        ? { ...p, name: editedPatientInfo.name }
                        : p
                    )
                  );

                  setEditingPatientField("");
                  alert("Patient profile has been successfully saved!");
                } catch (error) {
                  console.error("Error saving patient profile:", error);
                  alert("Failed to save patient profile. Please try again.");
                }
              }}
            >
              Save
            </button>
          </div>
        </div>
      )}

      {view === "add-patients" && (
        <div className="patients-sub">
          <button className="back-button" onClick={() => setView("patients")}>
            <FaArrowLeft />
          </button>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
          <h3 className="custom-h3">New Patient Profile</h3>

          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              placeholder="Enter name"
              value={newPatient.name}
              onChange={(e) =>
                setNewPatient({ ...newPatient, name: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              placeholder="Enter email"
              value={newPatient.email}
              onChange={(e) =>
                setNewPatient({ ...newPatient, email: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Phone Number:</label>
            <input
              type="tel"
              placeholder="Enter phone number"
              value={newPatient.phone}
              onChange={(e) => {
                const formattedValue = formatPhoneNumber(e.target.value);
                setNewPatient({ ...newPatient, phone: formattedValue });
              }}
            />
          </div>

          <div className="form-group">
            <label>Address:</label>
            <input
              type="text"
              placeholder="Enter address"
              value={newPatient.address}
              onChange={(e) =>
                setNewPatient({ ...newPatient, address: e.target.value })
              }
            />
          </div>

          <div className="popup-buttons">
            <button className="remove-btn" onClick={() => setView("patients")}>
              Cancel
            </button>
            <button
              className="save-profile-btn"
              disabled={patientHasInvalidInput(newPatient)}
              style={{
                opacity: !patientHasInvalidInput(newPatient) ? 1 : 0.5,
                cursor: !patientHasInvalidInput(newPatient)
                  ? "pointer"
                  : "not-allowed",
              }}
              onClick={async () => {
                try {
                  // Call the addPerson API with the new patient data
                  await addPerson({
                    name: newPatient.name,
                    email: newPatient.email,
                    phone_number: newPatient.phone,
                    address: newPatient.address,
                    status: "patient", // Set status as "patient"
                  });

                  // Update the patient list and details map
                  const newId = `patient${patientList.length + 1}`;
                  const newEntry = { id: newId, name: newPatient.name };

                  setPatientList([...patientList, newEntry]);
                  setPatientDetailsMap({
                    ...patientDetailsMap,
                    [newId]: {
                      name: newPatient.name,
                      email: newPatient.email,
                      phone: newPatient.phone,
                      address: newPatient.address,
                    },
                  });

                  // Clear the form and navigate back
                  setNewPatient({
                    name: "",
                    email: "",
                    phone: "",
                    address: "",
                  });
                  alert("Patient profile has been successfully added!");
                  setView("patients");
                } catch (error) {
                  console.error("Error adding patient:", error);
                  alert("Failed to add patient. Please try again.");
                }
              }}
            >
              Save
            </button>
          </div>
        </div>
      )}

      {view === "caretakers" && (
        <div className="profiles-sub">
          <button className="back-button" onClick={() => setView("main")}>
            <FaArrowLeft />{" "}
          </button>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
          <h3>Caretakers</h3>
          <button
            className="profile-action wide-button"
            onClick={() => setView("view-caretakers")}
          >
            <FaList /> View
          </button>
          <hr />
          <button
            className="profile-action wide-button"
            onClick={() => setView("add-caretakers")}
          >
            <FaPlus /> Add
          </button>
        </div>
      )}

      {view === "view-caretakers" && (
        <div className="profiles-sub">
          <button className="back-button" onClick={() => setView("caretakers")}>
            <FaArrowLeft />
          </button>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
          <h3>View Caretaker Profiles</h3>

          <div
            className="dropdown-full"
            ref={patientDropdownRef}
            style={{ flexDirection: "column" }}
          >
            <input
              type="text"
              className="dropdown-box"
              placeholder="Search Caretaker by Name"
              value={caretakerSearch}
              onChange={(e) => {
                setCaretakerSearch(e.target.value);
                setShowCaretakerDropdown(true);
              }}
              onClick={() => setShowCaretakerDropdown(true)}
            />
            <FaSearch className="dropdown-icon" />

            {showCaretakerDropdown && filteredCaretakers.length > 0 && (
              <div className="dropdown-menu">
                {filteredCaretakers.map((caretaker) => (
                  <div
                    key={caretaker.id}
                    className="dropdown-item"
                    onClick={() => {
                      setSelectedCaretaker(caretaker.id);
                      setCaretakerSearch(caretaker.name);
                      setShowCaretakerDropdown(false);
                      setView("view-caretaker-profile");
                      setEditedCaretakerInfo(caretakerDetailsMap[caretaker.id]);
                      setIsEditing(false);
                    }}
                  >
                    {caretaker.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {view === "view-caretaker-profile" && selectedCaretaker && (
        <div className="profiles-info-sub">
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
          <button
            className="back-button"
            onClick={() => setView("view-caretakers")}
          >
            <FaArrowLeft />
          </button>
          <h3>
            {caretakerDetailsMap[selectedCaretaker]?.name}
            <br />
            Profile
          </h3>

          <div className="profile-info-row">
            <strong>Name:</strong>
            {editingCaretakerField === "name" ? (
              <input
                value={editedCaretakerInfo.name}
                onChange={(e) =>
                  setEditedCaretakerInfo({
                    ...editedCaretakerInfo,
                    name: e.target.value,
                  })
                }
                className="edit-box"
              />
            ) : (
              <span className="profile-text">{editedCaretakerInfo.name}</span>
            )}
            <FaUserEdit
              className="edit-icon"
              onClick={() => {
                setEditingCaretakerField(
                  editingCaretakerField === "name" ? "" : "name"
                );
              }}
            />
          </div>

          <hr className="profile-hr" />
          <div className="profile-info-row">
            <strong>Email:</strong>
            {editingCaretakerField === "email" ? (
              <input
                value={editedCaretakerInfo.email}
                onChange={(e) =>
                  setEditedCaretakerInfo({
                    ...editedCaretakerInfo,
                    email: e.target.value,
                  })
                }
                className="edit-box"
              />
            ) : (
              <span className="profile-text">{editedCaretakerInfo.email}</span>
            )}
            <FaUserEdit
              className="edit-icon"
              onClick={() => {
                setEditingCaretakerField(
                  editingCaretakerField === "email" ? "" : "email"
                );
              }}
            />
          </div>

          <hr className="profile-hr" />
          <div className="profile-info-row">
            <strong>Phone:</strong>
            {editingCaretakerField === "phone" ? (
              <input
                placeholder="Enter phone number"
                value={editedCaretakerInfo.phone}
                onChange={(e) => {
                  const formattedValue = formatPhoneNumber(e.target.value);
                  setEditedCaretakerInfo({
                    ...editedCaretakerInfo,
                    phone: formattedValue,
                  });
                }}
                className="edit-box"
              />
            ) : (
              <span className="profile-text">{editedCaretakerInfo.phone}</span>
            )}
            <FaUserEdit
              className="edit-icon"
              onClick={() => {
                setEditingCaretakerField(
                  editingCaretakerField === "phone" ? "" : "phone"
                );
              }}
            />
          </div>

          <hr className="profile-hr" />
          <div className="profile-info-row">
            <strong>Address:</strong>
            {editingCaretakerField === "address" ? (
              <input
                value={editedCaretakerInfo.address}
                onChange={(e) =>
                  setEditedCaretakerInfo({
                    ...editedCaretakerInfo,
                    address: e.target.value,
                  })
                }
                className="edit-box"
              />
            ) : (
              <span className="profile-text">
                {editedCaretakerInfo.address}
              </span>
            )}
            <FaUserEdit
              className="edit-icon"
              onClick={() => {
                setEditingCaretakerField(
                  editingCaretakerField === "address" ? "" : "address"
                );
              }}
            />
          </div>

          <div className="popup-buttons">
            <button
              className="remove-btn"
              onClick={() =>
                handleDeleteCaretaker(caretakerDetailsMap[selectedCaretaker].id)
              }
            >
              Remove
            </button>

            <button
              className="save-profile-btn"
              disabled={
                !hasCaretakerChanges() ||
                caretakerHasInvalidInput(editedCaretakerInfo)
              }
              style={{
                opacity:
                  hasCaretakerChanges() &&
                  !caretakerHasInvalidInput(editedCaretakerInfo)
                    ? 1
                    : 0.5,
                cursor:
                  hasCaretakerChanges() &&
                  !caretakerHasInvalidInput(editedCaretakerInfo)
                    ? "pointer"
                    : "not-allowed",
              }}
              onClick={async () => {
                try {
                  // Call the updatePerson API with the edited caretaker data
                  await updatePerson(selectedCaretaker, {
                    name: editedCaretakerInfo.name,
                    email: editedCaretakerInfo.email,
                    phone_number: editedCaretakerInfo.phone,
                    address: editedCaretakerInfo.address,
                  });

                  // Update the local state with the edited data
                  setCaretakerDetailsMap({
                    ...caretakerDetailsMap,
                    [selectedCaretaker]: { ...editedCaretakerInfo },
                  });

                  setCaretakerList(
                    caretakerList.map((c) =>
                      c.id === selectedCaretaker
                        ? { ...c, name: editedCaretakerInfo.name }
                        : c
                    )
                  );

                  setEditingCaretakerField("");
                  alert("Caretaker profile has been successfully saved!");
                } catch (error) {
                  console.error("Error saving caretaker profile:", error);
                  alert("Failed to save caretaker profile. Please try again.");
                }
              }}
            >
              Save
            </button>
          </div>
        </div>
      )}

      {view === "add-caretakers" && (
        <div className="caretakers-sub">
          <button className="back-button" onClick={() => setView("caretakers")}>
            <FaArrowLeft />{" "}
          </button>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
          <h3>New Caretaker Profile</h3>

          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              placeholder="Enter name"
              value={newCaretaker.name}
              onChange={(e) =>
                setNewCaretaker({ ...newCaretaker, name: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              placeholder="Enter email"
              value={newCaretaker.email}
              onChange={(e) =>
                setNewCaretaker({ ...newCaretaker, email: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Phone Number:</label>
            <input
              type="tel"
              placeholder="Enter phone number"
              value={newCaretaker.phone}
              onChange={(e) => {
                const formattedValue = formatPhoneNumber(e.target.value);
                setNewCaretaker({ ...newCaretaker, phone: formattedValue });
              }}
            />
          </div>

          <div className="form-group">
            <label>Address:</label>
            <input
              type="text"
              placeholder="Enter address"
              value={newCaretaker.address}
              onChange={(e) =>
                setNewCaretaker({ ...newCaretaker, address: e.target.value })
              }
            />
          </div>

          <div className="popup-buttons">
            <button
              className="remove-btn"
              onClick={() => setView("caretakers")}
            >
              Cancel
            </button>
            <button
              className="save-profile-btn"
              disabled={caretakerHasInvalidInput(newCaretaker)}
              style={{
                opacity: !caretakerHasInvalidInput(newCaretaker) ? 1 : 0.5,
                cursor: !caretakerHasInvalidInput(newCaretaker)
                  ? "pointer"
                  : "not-allowed",
              }}
              onClick={async () => {
                try {
                  // Call the addPerson API with the new caretaker data
                  await addPerson({
                    name: newCaretaker.name,
                    email: newCaretaker.email,
                    phone_number: newCaretaker.phone,
                    address: newCaretaker.address,
                    status: "caretaker", // Set status as "caretaker"
                  });

                  // Update the caretaker list and details map
                  const newId = `caretaker${caretakerList.length + 1}`;
                  const newEntry = { id: newId, name: newCaretaker.name };

                  setCaretakerList([...caretakerList, newEntry]);
                  setCaretakerDetailsMap({
                    ...caretakerDetailsMap,
                    [newId]: {
                      name: newCaretaker.name,
                      email: newCaretaker.email,
                      phone: newCaretaker.phone,
                      address: newCaretaker.address,
                    },
                  });

                  // Clear the form and navigate back
                  setNewCaretaker({
                    name: "",
                    email: "",
                    phone: "",
                    address: "",
                  });
                  alert("Caretaker profile has been successfully added!");
                  setView("caretakers");
                } catch (error) {
                  console.error("Error adding caretaker:", error);
                  alert("Failed to add caretaker. Please try again.");
                }
              }}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profiles;
