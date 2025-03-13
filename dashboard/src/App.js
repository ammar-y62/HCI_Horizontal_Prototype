import React, { useEffect, useState } from "react";
import CalendarView from "./components/pages/CalendarView";

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

            <CalendarView />
      {/* <h1>Medical Clinic Scheduling Tool</h1>
      <h2>Home Page - Calendar Placeholder</h2>
      <p>Message from Flask: {message}</p> */}
    </div>
  );
}

export default App;
