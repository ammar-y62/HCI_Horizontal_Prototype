import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import "../../assets/styles/CalendarView.css";
import { FaFilter, FaUser, FaCalendarAlt, FaList, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const CalendarView = () => {
  const [view, setView] = useState("dayGridMonth");

  const events = [
    { title: "12 appointments", date: "2029-04-01" },
    { title: "9 appointments", date: "2029-04-02" },
    { title: "6 appointments", date: "2029-04-03" },
    { title: "3 appointments", date: "2029-04-03" },
    { title: "12 appointments", date: "2029-04-08" },
  ];

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button className="filter-button"><FaFilter /> Filter</button>
        <button className="profiles-button"><FaUser /> Profiles</button>
        <div className="view-toggle">
          <button className={view === "dayGridMonth" ? "active" : ""} onClick={() => setView("dayGridMonth")}>
            <FaCalendarAlt /> Month
          </button>
          <button className={view === "timeGridDay" ? "active" : ""} onClick={() => setView("timeGridDay")}>
            <FaList /> Day
          </button>
        </div>
        <div className="navigation">
          <button className="nav-button"><FaChevronLeft /></button>
          <h2 className="calendar-title">April 2029</h2>
          <button className="nav-button"><FaChevronRight /></button>
        </div>
      </div>
      <div className="calendar-wrapper">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView={view}
          events={events}
          headerToolbar={false} // Hide default header
          dayHeaderClassNames={(date) => (date.isWeekend ? "weekend-header" : "weekday-header")}
          dayCellClassNames={(date) => (date.isWeekend ? "weekend-cell" : "weekday-cell")}
          eventContent={({ event }) => (
            <div className="event-badge" title={event.title}>{event.title}</div>
          )}
        />
      </div>
    </div>
  );
};

export default CalendarView;