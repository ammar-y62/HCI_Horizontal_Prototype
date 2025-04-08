// src/api/api.js
const BASE_URL = "http://127.0.0.1:5000";

// Helper function to perform API requests
async function apiFetch(endpoint, options = {}) {
  try {
    console.log(`Making API request to: ${BASE_URL}${endpoint}`, options);
    
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    
    // Log response status
    console.log(`API response status: ${response.status} ${response.statusText}`);
    
    // If error, try to get more details
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error response: ${errorText}`);
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    // Parse and return JSON
    const data = await response.json();
    console.log("API response data:", data);
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
  // Try all possible field name combinations that your backend might expect
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
    urgency: Number(appointmentData.urgency)
  };
  
  console.log("Formatted data for API:", formattedData);
  
  return apiFetch("/api/appointments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formattedData),
  });
};

// Update an existing appointment
export const updateAppointment = (id, appointmentData) => {
  // Try all possible field name combinations that your backend might expect
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
    urgency: Number(appointmentData.urgency)
  };
  
  console.log(`Formatted data for API update (ID: ${id}):`, formattedData);
  
  return apiFetch(`/api/appointments/${id}`, {
    method: "PUT", // Make sure your API supports PUT for updates
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