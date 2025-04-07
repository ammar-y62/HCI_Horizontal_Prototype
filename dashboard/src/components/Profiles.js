import React, { useState, useRef, useEffect } from "react";
import { FaTimes, FaArrowLeft, FaUser, FaList, FaPlus, FaSearch, FaUserEdit, FaUserNurse } from "react-icons/fa";
import "../assets/styles/Profiles.css"; // Separate styling for Profiles



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

  

  // Mock patient list for now (replace with real fetched list)
  const [patientList, setPatientList] = useState([
    { id: "patient1", name: "Patient 1" },
    { id: "patient2", name: "Patient 2" },
    { id: "patient3", name: "Patient 3" },
  ]);

  const [caretakerList, setCaretakerList] = useState([
    { id: "caretaker1", name: "Caretaker 1" },
    { id: "caretaker2", name: "Caretaker 2" },
    { id: "caretaker3", name: "Caretaker 3" },
  ]);
  
  const [newCaretaker, setNewCaretaker] = useState({
    name: "",
    position: "",
    email: "",
    phone: "",
    address: ""
  });
  
  
  const [patientDetailsMap, setPatientDetailsMap] = useState({
    patient1: {
      name: "Patient 1",
      email: "example@example.com",
      phone: "403-123-4567",
      address: "123 Example Street"
    },
    patient2: {
      name: "Patient 2",
      email: "patient2@example.com",
      phone: "403-234-5678",
      address: "456 Sample Avenue"
    },
    patient3: {
      name: "Patient 3",
      email: "patient3@example.com",
      phone: "403-345-6789",
      address: "789 Test Boulevard"
    }
  });
  

  const [caretakerDetailsMap, setCaretakerDetailsMap] = useState({
    caretaker1: {
      name: "Caretaker 1",
      email: "example@example.com",
      phone: "403-123-4567",
      address: "123 Example Street"
    },
    caretaker2: {
      name: "Caretaker 2",
      email: "Caretaker2@example.com",
      phone: "403-234-5678",
      address: "456 Sample Avenue"
    },
    caretaker3: {
      name: "Caretaker 3",
      email: "Caretaker3@example.com",
      phone: "403-345-6789",
      address: "789 Test Boulevard"
    }
  });
  

  // Filter based on search input
  const filteredPatients = patientList.filter(p =>
    p.name.toLowerCase().includes(patientSearch.toLowerCase())
  );

  const filteredCaretakers = caretakerList.filter(p =>
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
          <button className="close-button" onClick={onClose}><FaTimes /></button>
          <h3>Profile Management</h3>
          <div className="center-container">
            <button className="profile-option center-button" onClick={() => setView("patients")}>
              <FaUser /> Patients
            </button>
            <hr />
            <button className="profile-option center-button" onClick={() => setView("caretakers")}>
              <FaUserNurse /> Caretakers
            </button>
          </div>
        </div>
      )}

      {view === "patients" && (
        <div className="profiles-sub">
          <button className="back-button" onClick={() => setView("main")}><FaArrowLeft /> </button>
          <button className="close-button" onClick={onClose}><FaTimes /></button>
          <h3>Patients</h3>
          <button className="profile-action wide-button" onClick={() =>setView("view-patients")}><FaList /> View</button>
          <hr />
          <button className="profile-action wide-button" onClick={() => setView ("add-patients")}><FaPlus /> Add</button>
        </div>
      )}

      {view === "view-patients" && (
        <div className="profiles-sub">
          <button className="back-button" onClick={() => setView("patients")}><FaArrowLeft /></button>
          <button className="close-button" onClick={onClose}><FaTimes /></button>
          <h3>View Patient Profiles</h3>
          
          <div className="dropdown-full" ref={patientDropdownRef} style={{flexDirection: "column" }}>
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
          <button className="close-button" onClick={onClose}><FaTimes /></button>
          <button className="back-button" onClick={() => setView("view-patients")}><FaArrowLeft /></button>
          <h3>{patientDetailsMap[selectedPatient]?.name}<br />Profile</h3>

          <div className="profile-info-row">
            <strong>Name:</strong>
            {editingPatientField === "name" ? (
            <input
              value={editedPatientInfo.name}
              onChange={(e) => setEditedPatientInfo({ ...editedPatientInfo, name: e.target.value })}
              className="edit-box"
            />
          ) : (
            <span className="profile-text">{editedPatientInfo.name}</span>
          )}
          <FaUserEdit
            className="edit-icon"
            onClick={() => {
              setEditingPatientField(editingPatientField === "name" ? "" : "name");
            }}
          />
          </div>

          <hr className="profile-hr" />
          <div className="profile-info-row">
            <strong>Email:</strong>
            {editingPatientField === "email" ? (
            <input
              value={editedPatientInfo.email}
              onChange={(e) => setEditedPatientInfo({ ...editedPatientInfo, email: e.target.value })}
              className="edit-box"
            />
          ) : (
            <span className="profile-text">{editedPatientInfo.email}</span>
          )}
          <FaUserEdit
            className="edit-icon"
            onClick={() => {
              setEditingPatientField(editingPatientField === "email" ? "" : "email");
            }}
          />
          </div>

          <hr className="profile-hr" />
          <div className="profile-info-row">
            <strong>Phone:</strong>
            {editingPatientField === "phone" ? (
            <input
              value={editedPatientInfo.phone}
              onChange={(e) => setEditedPatientInfo({ ...editedPatientInfo, phone: e.target.value })}
              className="edit-box"
            />
          ) : (
            <span className="profile-text">{editedPatientInfo.phone}</span>
          )}
          <FaUserEdit
            className="edit-icon"
            onClick={() => {
              setEditingPatientField(editingPatientField === "phone" ? "" : "phone");
            }}
          />
          </div>

          <hr className="profile-hr" />
          <div className="profile-info-row">
            <strong>Address:</strong>
            {editingPatientField === "address" ? (
              <input
                value={editedPatientInfo.address}
                onChange={(e) => setEditedPatientInfo({ ...editedPatientInfo, address: e.target.value })}
                className="edit-box"
              />
            ) : (
              <span className="profile-text">{editedPatientInfo.address}</span>
            )}
            <FaUserEdit
              className="edit-icon"
              onClick={() => {
                setEditingPatientField(editingPatientField === "address" ? "" : "address");
              }}
            />
          </div>

          <div className="popup-buttons">
            <button
              className="remove-btn"
              onClick={() => {
                const confirmDelete = window.confirm("Are you sure you want to remove this patient profile?");
                if (confirmDelete) {
                  setPatientList(patientList.filter(p => p.id !== selectedPatient));
                  const updatedMap = { ...patientDetailsMap };
                  delete updatedMap[selectedPatient];
                  setPatientDetailsMap(updatedMap);
                  setSelectedPatient("");
                  setPatientSearch("");
                  setView("view-patients");
                }
              }}
            >
              Remove
            </button>

            <button
              className="save-profile-btn"
              disabled={!hasPatientChanges()}
              style={{ opacity: hasPatientChanges() ? 1 : 0.5, cursor: hasPatientChanges() ? "pointer" : "not-allowed" }}
              onClick={() => {
                setPatientDetailsMap({
                  ...patientDetailsMap,
                  [selectedPatient]: { ...editedPatientInfo }
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
              }}                         
            >
              Save
          </button>

          </div>
        </div>
      )}


      {view === "add-patients" && (
        <div className="patients-sub">
          <button className="back-button" onClick={() => setView("patients")}><FaArrowLeft /></button>
          <button className="close-button" onClick={onClose}><FaTimes /></button>
          <h3 className="custom-h3">New Patient Profile</h3>

          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              placeholder="Enter name"
              value={newPatient.name}
              onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              placeholder="Enter email"
              value={newPatient.email}
              onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Phone Number:</label>
            <input
              type="tel"
              placeholder="Enter phone number"
              value={newPatient.phone}
              onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Address:</label>
            <input
              type="text"
              placeholder="Enter address"
              value={newPatient.address}
              onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
            />
          </div>

          <div className="popup-buttons">
            <button className="remove-btn" onClick={() => setView("patients")}>Cancel</button>
            <button
              className="save-profile-btn"
              onClick={() => {
                const newId = `patient${patientList.length + 1}`;
                const newEntry = { id: newId, name: newPatient.name };

                // 1. Add to dropdown list
                setPatientList([...patientList, newEntry]);

                // 2. Add to patientDetailsMap
                setPatientDetailsMap({
                  ...patientDetailsMap,
                  [newId]: {
                    name: newPatient.name,
                    email: newPatient.email,
                    phone: newPatient.phone,
                    address: newPatient.address
                  }
                });

                // 3. Clear form
                setNewPatient({ name: "", email: "", phone: "", address: "" });

                alert("Patient profile has been successfully added!");
                setView("patients");
              }}
            >
              Save
            </button>

          </div>
        </div>
      )}

      {view === "caretakers" && (
        <div className="profiles-sub">
          <button className="back-button" onClick={() => setView("main")}><FaArrowLeft /> </button>
          <button className="close-button" onClick={onClose}><FaTimes /></button>
          <h3>Caretakers</h3>
          <button className="profile-action wide-button" onClick={() => setView("view-caretakers")}><FaList /> View</button>
          <hr />
          <button className="profile-action wide-button" onClick={() => setView("add-caretakers")}><FaPlus /> Add</button>
        </div>
      )}

      {view === "view-caretakers" && (
        <div className="profiles-sub">
          <button className="back-button" onClick={() => setView("caretakers")}><FaArrowLeft /></button>
          <button className="close-button" onClick={onClose}><FaTimes /></button>
          <h3>View Caretaker Profiles</h3>

          <div className="dropdown-full" ref={patientDropdownRef} style={{ flexDirection: "column" }}>
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
          <button className="close-button" onClick={onClose}><FaTimes /></button>
          <button className="back-button" onClick={() => setView("view-caretakers")}><FaArrowLeft /></button>
          <h3>{caretakerDetailsMap[selectedCaretaker]?.name}<br />Profile</h3>

          <div className="profile-info-row">
            <strong>Name:</strong>
            {editingCaretakerField === "name" ? (
            <input
              value={editedCaretakerInfo.name}
              onChange={(e) => setEditedCaretakerInfo({ ...editedCaretakerInfo, name: e.target.value })}
              className="edit-box"
            />
          ) : (
            <span className="profile-text">{editedCaretakerInfo.name}</span>
          )}
          <FaUserEdit
            className="edit-icon"
            onClick={() => {
              setEditingCaretakerField(editingCaretakerField === "name" ? "" : "name");
            }}
          />
          </div>

          <hr className="profile-hr" />
          <div className="profile-info-row">
            <strong>Email:</strong>
            {editingCaretakerField === "email" ? (
            <input
              value={editedCaretakerInfo.email}
              onChange={(e) => setEditedCaretakerInfo({ ...editedCaretakerInfo, email: e.target.value })}
              className="edit-box"
            />
          ) : (
            <span className="profile-text">{editedCaretakerInfo.email}</span>
          )}
          <FaUserEdit
            className="edit-icon"
            onClick={() => {
              setEditingCaretakerField(editingCaretakerField === "email" ? "" : "email");
            }}
          />
          </div>

          <hr className="profile-hr" />
          <div className="profile-info-row">
            <strong>Phone:</strong>
            {editingCaretakerField === "phone" ? (
            <input
              value={editedCaretakerInfo.phone}
              onChange={(e) => setEditedCaretakerInfo({ ...editedCaretakerInfo, phone: e.target.value })}
              className="edit-box"
            />
          ) : (
            <span className="profile-text">{editedCaretakerInfo.phone}</span>
          )}
          <FaUserEdit
            className="edit-icon"
            onClick={() => {
              setEditingCaretakerField(editingCaretakerField === "phone" ? "" : "phone");
            }}
          />
          </div>

          <hr className="profile-hr" />
          <div className="profile-info-row">
            <strong>Address:</strong>
            {editingCaretakerField === "address" ? (
            <input
              value={editedCaretakerInfo.address}
              onChange={(e) => setEditedCaretakerInfo({ ...editedCaretakerInfo, address: e.target.value })}
              className="edit-box"
            />
          ) : (
            <span className="profile-text">{editedCaretakerInfo.address}</span>
          )}
          <FaUserEdit
            className="edit-icon"
            onClick={() => {
              setEditingCaretakerField(editingCaretakerField === "address" ? "" : "address");
            }}
          />
          </div>

          <div className="popup-buttons">
            <button
              className="remove-btn"
              onClick={() => {
                const confirmDelete = window.confirm("Are you sure you want to remove this caretaker profile?");
                if (confirmDelete) {
                  setCaretakerList(caretakerList.filter(c => c.id !== selectedCaretaker));
                  const updatedMap = { ...caretakerDetailsMap };
                  delete updatedMap[selectedCaretaker];
                  setCaretakerDetailsMap(updatedMap);
                  setSelectedCaretaker("");
                  setCaretakerSearch("");
                  setView("view-caretakers");
                }
              }}
            >
              Remove
            </button>

            <button
              className="save-profile-btn"
              disabled={!hasCaretakerChanges()}
              style={{ opacity: hasCaretakerChanges() ? 1 : 0.5, cursor: hasCaretakerChanges() ? "pointer" : "not-allowed" }}
              onClick={() => {
                setCaretakerDetailsMap({
                  ...caretakerDetailsMap,
                  [selectedCaretaker]: { ...editedCaretakerInfo }
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
              }}              
            >
              Save
          </button>

          </div>
        </div>
      )}


      {view === "add-caretakers" && (
        <div className="caretakers-sub">
          <button className="back-button" onClick={() => setView("caretakers")}><FaArrowLeft /> </button>
          <button className="close-button" onClick={onClose}><FaTimes /></button>
          <h3>New Caretaker Profile</h3>

          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              placeholder="Enter name"
              value={newCaretaker.name}
              onChange={(e) => setNewCaretaker({ ...newCaretaker, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Position:</label>
            <input
              type="text"
              placeholder="Enter Position"
              value={newCaretaker.position}
              onChange={(e) => setNewCaretaker({ ...newCaretaker, position: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              placeholder="Enter email"
              value={newCaretaker.email}
              onChange={(e) => setNewCaretaker({ ...newCaretaker, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Phone Number:</label>
            <input
              type="tel"
              placeholder="Enter phone number"
              value={newCaretaker.phone}
              onChange={(e) => setNewCaretaker({ ...newCaretaker, phone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Address:</label>
            <input
              type="text"
              placeholder="Enter address"
              value={newCaretaker.address}
              onChange={(e) => setNewCaretaker({ ...newCaretaker, address: e.target.value })}
            />
          </div>

          <div className="popup-buttons">
            <button className="remove-btn" onClick={() => setView("caretakers")}>Cancel</button>
            <button
              className="save-profile-btn"
              onClick={() => {
                const newId = `caretaker${caretakerList.length + 1}`;
                const newEntry = { id: newId, name: newCaretaker.name };

                setCaretakerList([...caretakerList, newEntry]);

                setCaretakerDetailsMap({
                  ...caretakerDetailsMap,
                  [newId]: {
                    name: newCaretaker.name,
                    email: newCaretaker.email,
                    phone: newCaretaker.phone,
                    address: newCaretaker.address
                  }
                });

                setNewCaretaker({ name: "", position: "", email: "", phone: "", address: "" });

                alert("Caretaker profile has been successfully added!");
                setView("caretakers");
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