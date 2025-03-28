// src/components/CalendarView.jsx

import React, { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import {
  FaFilter,
  FaUser,
  FaCalendarAlt,
  FaList,
  FaChevronLeft,
  FaChevronRight,
  FaEdit,
  FaCaretDown,
} from "react-icons/fa";

import { fetchAppointments } from "../api/api";
import Filter from "./Filter";
import Profiles from "./Profiles";
import AppointmentPopup from "./Appointments";

import "../assets/styles/CalendarView.css";

const CalendarView = () => {
  // Ref for calling .prev() / .next() directly
  const calendarRef = useRef(null);

  // Which view we're in: "dayGridMonth" or "resourceTimeGridDay"
  const [view, setView] = useState("dayGridMonth");

  // Title text (e.g. "April 2025") that we show in the header
  const [titleText, setTitleText] = useState("");

  // The events for the current visible date range
  const [events, setEvents] = useState([]);

  // Toggles for Filter/Profiles drawers
  const [showFilter, setShowFilter] = useState(false);
  const [showProfiles, setShowProfiles] = useState(false);

  // If user selects a time slot in Day View, open popup
  const [selectedSlot, setSelectedSlot] = useState(null);

  /**
   * Called automatically by FullCalendar whenever:
   *   - The user clicks Next/Prev
   *   - The user changes the view (Month <-> Day)
   *   - The initial render occurs
   *
   * This is where we:
   *   1) fetch all your appointments
   *   2) filter them to the new date range
   *   3) set them in state
   *   4) update the header title to match FullCalendar's built‐in title
   */
  const handleDatesSet = async (dateInfo) => {
    try {
      // 1) The new date range
      const { start, end, view } = dateInfo; // start & end are date objects
      // 2) Update our title from FullCalendar’s own view.title
      setTitleText(view.title);

      // 3) Fetch your entire appointments list from the backend
      const data = await fetchAppointments();

      // 4) Filter them to fall within [start, end)
      const filtered = data.filter((apt) => {
        const apptDate = new Date(apt.date_time);
        return apptDate >= start && apptDate < end;
      });

      // 5) Transform them into event objects that FullCalendar expects
      const newEvents = filtered.map((apt) => ({
        id: apt.id,
        title: `Room ${apt.room_number}`, // e.g. "Room 3"
        start: apt.date_time, // e.g. "2025-04-03T09:00:00"
        date: apt.date_time.split("T")[0],
        resourceId: String(apt.room_number), // must match "1".."7" if day view
        patient: apt.patient_id,
        doctor: apt.doctor_id,
      }));

      setEvents(newEvents);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    }
  };

  /**
   * Custom buttons for month navigation
   * We call getApi() on the FullCalendar instance (via ref),
   * but only if it’s non‐null to avoid errors.
   */
  const handlePrev = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().prev();
    }
  };
  const handleNext = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().next();
    }
  };

  /**
   * Switch to Month View or Day View
   */
  const switchToMonthView = () => {
    setView("dayGridMonth");
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView("dayGridMonth");
    }
  };
  const switchToDayView = () => {
    setView("resourceTimeGridDay");
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView("resourceTimeGridDay");
    }
  };

  return (
    <div className="calendar-container">
      {/* ---- Top Navigation ---- */}
      <div className="calendar-header">
        <div className="left-section">
          <button
            className="icon-button"
            onClick={() => setShowFilter(!showFilter)}
          >
            <FaFilter /> Filter
            <FaCaretDown />
          </button>
          {showFilter && <Filter onClose={() => setShowFilter(false)} />}

          <button
            className="icon-button"
            onClick={() => setShowProfiles(!showProfiles)}
          >
            <FaUser /> Profiles
          </button>
          {showProfiles && <Profiles onClose={() => setShowProfiles(false)} />}
        </div>

        <div className="right-section">
          {/* Toggle Month/Day view */}
          <div className="view-toggle">
            <button
              className={view === "dayGridMonth" ? "active" : ""}
              onClick={switchToMonthView}
            >
              <FaCalendarAlt /> Month
            </button>
            <button
              className={view === "resourceTimeGridDay" ? "active" : ""}
              onClick={switchToDayView}
            >
              <FaList /> Day
            </button>
            {showProfiles && (
              <Profiles onClose={() => setShowProfiles(false)} />
            )}
          </div>

          {/* Arrows + Title */}
          <div className="navigation">
            <button className="nav-button nav-button-left" onClick={handlePrev}>
              <FaChevronLeft />
            </button>

            <button
              className="nav-button nav-button-right"
              onClick={handleNext}
            >
              <FaChevronRight />
            </button>
          </div>
          <h2 className="calendar-title">{titleText}</h2>
        </div>
      </div>

      {/* ---- The Calendar ---- */}
      <div className="calendar-wrapper">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, resourceTimeGridPlugin, interactionPlugin]}
          headerToolbar={false}
          footerToolbar={false}
          initialView={view}
          // This fires whenever the user navigates or changes view
          datesSet={handleDatesSet}
          // Our events from state
          events={events}
          // We allow selecting time slots in Day View
          selectable={true}
          /* =============== MONTH VIEW CONFIG =============== */
          views={{
            dayGridMonth: {
              // Hide real events (bullets) so we can show "X appointments" ourselves
              eventDisplay: "none",
              // Clicking a day in month view -> switch to day view for that date
              dateClick: (info) => {
                switchToDayView();
                if (calendarRef.current) {
                  calendarRef.current.getApi().gotoDate(info.date);
                }
              },
              // Show day number plus "X appointments"
              dayCellContent: (arg) => {
                const dayNumber = arg.dayNumberText;
                const dateStr = arg.dateStr;
                const dayEvents = events.filter((evt) => evt.date === dateStr);

                if (dayEvents.length > 0) {
                  return {
                    html: `
                      <div class="fc-daygrid-day-number">${dayNumber}</div>
                      <div class="month-appointments">${dayEvents.length} appointments</div>
                    `,
                  };
                }
                // Otherwise just the day number
                return {
                  html: `<div class="fc-daygrid-day-number">${dayNumber}</div>`,
                };
              },
            },

            /* =============== DAY VIEW CONFIG =============== */
            resourceTimeGridDay: {
              type: "resourceTimeGridDay",
              allDaySlot: false, // remove the "all‐day" row
              slotMinTime: "09:00:00", // start at 9 AM
              slotMaxTime: "16:00:00", // go until 4 PM
              slotDuration: "01:00:00", // 1 hour per slot
              slotLabelInterval: { hours: 1 },
              slotLabelFormat: {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              },
              resourceAreaHeaderContent: "Rooms",
              resourceAreaWidth: "120px",
              eventDisplay: "auto", // show the event in a colored box

              // Custom rendering of each event in day view
              eventContent: (arg) => {
                const { event } = arg;
                const { title, extendedProps } = event;
                return (
                  <div
                    style={{
                      backgroundColor: "#d0f0ff",
                      padding: "5px",
                      borderRadius: "4px",
                    }}
                  >
                    <div>
                      <strong>{title}</strong>
                    </div>
                    <div style={{ fontSize: "0.85rem" }}>
                      {extendedProps.patient} w/ {extendedProps.doctor}
                    </div>
                  </div>
                );
              },
            },
          }}
          // Hard-coded rooms 1..7
          resources={[
            { id: "1", title: "Room 1" },
            { id: "2", title: "Room 2" },
            { id: "3", title: "Room 3" },
            { id: "4", title: "Room 4" },
            { id: "5", title: "Room 5" },
            { id: "6", title: "Room 6" },
            { id: "7", title: "Room 7" },
          ]}
          /* User selects a slot in Day View => open your AppointmentPopup */
          select={(info) => {
            if (info.view.type === "resourceTimeGridDay") {
              setSelectedSlot({
                // The raw room number "1".."7"
                room: info.resource?.id || "",
                // e.g. "09:00 AM"
                time: new Date(info.start).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              });
            }
          }}
        />
      </div>

      {/* ---- Popup for new/edit appointment ---- */}
      {selectedSlot && (
        <AppointmentPopup
          room={selectedSlot.room}
          time={selectedSlot.time}
          date={titleText}
          // If you need the date, you can store info.start in selectedSlot
          onClose={() => setSelectedSlot(null)}
        />
      )}
    </div>
  );
};

export default CalendarView;
