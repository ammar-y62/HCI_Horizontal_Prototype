import React, { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");
  
  useEffect(() => {
    // Example: fetch data from Flask
    fetch("http://127.0.0.1:5000/api/hello")
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Medical Clinic Scheduling Tool</h1>
      <h2>Home Page - Calendar Placeholder</h2>
      <p>Message from Flask: {message}</p>
      {/* 
        TODO: Add your calendar component here or any other UI components.
        For example, you can integrate libraries like react-calendar or 
        react-big-calendar for a scheduling view.
      */}
    </div>
  );
}

export default App;
