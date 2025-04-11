// src/api/api.js
const BASE_URL = "https://medical-clinic-tool.onrender.com";

// Helper function to perform API requests
async function apiFetch(endpoint, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    // Parse and return JSON
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error in API call to ${endpoint}:`, error);
    throw error;
  }
}

// Fetch all people
export const fetchPeople = () => apiFetch("/api/people");

// Add a new person
export const addPerson = (personData) =>
  apiFetch("/api/people", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(personData),
  });

// Fetch all appointments
export const fetchAppointments = () => apiFetch("/api/appointments");

// Fetch a specific appointment by ID
export const fetchAppointmentById = (id) => apiFetch(`/api/appointments/${id}`);

// Add a new appointment
export const addAppointment = (appointmentData) => {
  const formattedData = {
    // Room field variations
    room: appointmentData.room_number || appointmentData.room,
    room_number: appointmentData.room_number || appointmentData.room,
    // Date/time field variations
    date_time: appointmentData.date_time,
    datetime: appointmentData.date_time,
    // Patient field variations
    patient_id: appointmentData.patient_id,
    patient: appointmentData.patient_id,
    // Doctor field variations
    doctor_id: appointmentData.doctor_id,
    doctor: appointmentData.doctor_id,
    // Urgency always as a number
    urgency: Number(appointmentData.urgency),
    notes: appointmentData.notes,

  };


  return apiFetch("/api/appointments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formattedData),
  });
};

// Update an existing appointment
export const updateAppointment = (id, appointmentData) => {
  const formattedData = {
    // Room field variations
    room: appointmentData.room_number || appointmentData.room,
    room_number: appointmentData.room_number || appointmentData.room,
    // Date/time field variations
    date_time: appointmentData.date_time,
    datetime: appointmentData.date_time,
    // Patient field variations
    patient_id: appointmentData.patient_id,
    patient: appointmentData.patient_id,
    // Doctor field variations
    doctor_id: appointmentData.doctor_id,
    doctor: appointmentData.doctor_id,
    // Urgency always as a number
    urgency: Number(appointmentData.urgency),
    notes: appointmentData.notes,
  };

  return apiFetch(`/api/appointments/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formattedData),
  });
};

// Delete an appointment by ID
export const deleteAppointment = (id) =>
  apiFetch(`/api/appointments/${id}`, {
    method: "DELETE",
  });
// Delete a person by ID
export const deletePerson = (id) =>
  apiFetch(`/api/people/${id}`, {
    method: "DELETE",
  });
// Update a person by ID
export const updatePerson = (id, personData) =>
  apiFetch(`/api/people/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(personData),
  });