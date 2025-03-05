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

// Example API get
export const fetchFileName = () =>
    apiFetch('/api/get_file_name');

// Example API send
export const saveScript = (scriptContent) =>
    apiFetch('/api/save_script', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ script: scriptContent }),
    });