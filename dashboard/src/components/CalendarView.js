import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "../assets/styles/CalendarView.css";

import {
  FaFilter,
  FaUser,
  FaCalendarAlt,
  FaList,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import { fetchAppointments } from "../api/api";
import Filter from "./Filter";
import Profiles from "./Profiles";
import AppointmentPopup from "./Appointments";

const CalendarView = () => {
  const [view, setView] = useState("dayGridMonth");
  const [events, setEvents] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [showProfiles, setShowProfiles] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const data = await fetchAppointments();
        setEvents(
          data.map((appointment) => ({
            title: `Room ${appointment.room_number} - ${appointment.patient_id}`,
            date: appointment.date_time.split("T")[0],
            start: appointment.date_time,
            resourceId: appointment.room_number.toString(),
          }))
        );
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      }
    };
    loadAppointments();
  }, []);

  const changeDate = (direction) => {
    const newDate = new Date(currentDate);
    if (view === "dayGridMonth") {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    } else {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const getTitle = () => {
    if (view === "dayGridMonth") {
      return currentDate.toLocaleString("en-US", { month: "long", year: "numeric" });
    }
    return currentDate.toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="calendar-container">
      {/* Navigation Header */}
      <div className="calendar-header fixed-header">
        <button className="filter-button" onClick={() => setShowFilter(!showFilter)}>
          <FaFilter /> Filter
        </button>
        {showFilter && <Filter onClose={() => setShowFilter(false)} />}

        <button className="profiles-button" onClick={() => setShowProfiles(!showProfiles)}>
          <FaUser /> Profiles
        </button>
        {showProfiles && <Profiles onClose={() => setShowProfiles(false)} />}

        <div className="view-toggle">
          <button className={view === "dayGridMonth" ? "active" : ""} onClick={() => setView("dayGridMonth")}>
            <FaCalendarAlt /> Month
          </button>
          <button className={view === "resourceTimeGridDay" ? "active" : ""} onClick={() => setView("resourceTimeGridDay")}>
            <FaList /> Day
          </button>
        </div>

        <div className="navigation">
          <button className="nav-button" onClick={() => changeDate("prev")}><FaChevronLeft /></button>
          <h2 className="calendar-title">{getTitle()}</h2>
          <button className="nav-button" onClick={() => changeDate("next")}><FaChevronRight /></button>
        </div>
      </div>

      {/* Calendar Body */}
      <div className="calendar-wrapper">
        <FullCalendar
          plugins={[dayGridPlugin, resourceTimeGridPlugin, interactionPlugin]}
          initialView={view}
          key={view}
          events={events}
          headerToolbar={false}
          date={currentDate}
          allDaySlot={false}
          selectable={true}
          select={(info) => {
            if (view === "resourceTimeGridDay") {
              setSelectedSlot({
                room: info.resource?.title || "N/A",
                time: new Date(info.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              });
            }
          }}
          slotMinTime="09:00:00"
          slotMaxTime="17:00:00"
          resources={[
            { id: "1", title: "Room 1" },
            { id: "2", title: "Room 2" },
            { id: "3", title: "Room 3" },
            { id: "4", title: "Room 4" },
            { id: "5", title: "Room 5" },
            { id: "6", title: "Room 6" },
            { id: "7", title: "Room 7" },
          ]}
          views={{
            dayGridMonth: { type: "dayGridMonth" },
            resourceTimeGridDay: {
              type: "resourceTimeGridDay",
              slotDuration: "01:00:00",
              slotLabelInterval: { hours: 1 },
              slotLabelFormat: { hour: "numeric", minute: "2-digit", hour12: true },
              resourceAreaWidth: "15%",
              resourceAreaHeaderContent: "Rooms",
            },
          }}
          dayHeaderClassNames={(date) => (date.isWeekend ? "weekend-header" : "weekday-header")}
          dayCellClassNames={(date) => (date.isWeekend ? "weekend-cell" : "weekday-cell")}
          eventContent={({ event }) => (
            <div className="event-badge" title={event.title}>{event.title}</div>
          )}
        />
      </div>

      {/* Appointment Popup */}
      {selectedSlot && (
        <AppointmentPopup
          room={selectedSlot.room}
          time={selectedSlot.time}
          onClose={() => setSelectedSlot(null)}
        />
      )}
    </div>
  );
};

export default CalendarView;
