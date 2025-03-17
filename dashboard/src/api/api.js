// src/api.js
const BASE_URL = "http://127.0.0.1:5000";

// Helper function to perform API requests
async function apiFetch(endpoint, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    return await response.json();
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

// Add a new appointment
export const addAppointment = (appointmentData) =>
  apiFetch("/api/appointments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(appointmentData),
  });
