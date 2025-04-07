// src/components/CalendarView.jsx
import React, { useState, useRef,useEffect } from "react";
import ReactDOM from "react-dom/client";
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
import { IoEnterOutline } from "react-icons/io5";
import { FiPlusCircle } from "react-icons/fi";
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
  const [currentRange, setCurrentRange] = useState(null);
  const [filters, setFilters] = useState({ patient: [], doctor: [] });
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [selectedCaretakers, setSelectedCaretakers] = useState([]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setSelectedPatients(newFilters.patient); // Update selected patients
    setSelectedCaretakers(newFilters.doctor); // Update selected caretakers
  };
  useEffect(() => {
    if (currentRange) {
      refreshEvents();
    }
  }, [filters]);
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
      const { start, end, view } = dateInfo;
      setCurrentRange({ start, end }); // store current range
      let title = view.title;
      if (view.type === "resourceTimeGridDay") {
        const dayOptions = { weekday: "long" };
        const dateOptions = { month: "long", day: "numeric", year: "numeric" };
        const dayName = start.toLocaleDateString("en-US", dayOptions);
        const dateStr = start.toLocaleDateString("en-US", dateOptions);
        // Insert <br/> between dayName and dateStr
        title = `${dayName}<br/>${dateStr}`;
      }
      setTitleText(title);
      const data = await fetchAppointments();
      const filtered = data.filter((apt) => {
        const apptDate = new Date(apt.date_time);
        return apptDate >= start && apptDate < end;
      });
      const newEvents = filtered.map((apt) => ({
        id: apt.id,
        title: `Room ${apt.room_number}`,
        start: apt.date_time,
        date: apt.date_time.split("T")[0],
        resourceId: String(apt.room_number),
        extendedProps: {
          patient: apt.patient_id,
          doctor: apt.doctor_id,
          urgency: apt.urgency,
        },
      }));
      setEvents(newEvents);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    }
  };
  const refreshEvents = async () => {
    if (!currentRange) return;
    try {
      const data = await fetchAppointments();
      let filtered = data.filter((apt) => {
        const apptDate = new Date(apt.date_time);
        return apptDate >= currentRange.start && apptDate < currentRange.end;
      });

      // Apply patient filter if any
      if (filters.patient.length > 0) {
        filtered = filtered.filter(apt => filters.patient.includes(apt.patient_id));
      }
      // Apply doctor filter if any
      if (filters.doctor.length > 0) {
        filtered = filtered.filter(apt => filters.doctor.includes(apt.doctor_id));
      }

      const newEvents = filtered.map((apt) => ({
        id: apt.id,
        title: `Room ${apt.room_number}`,
        start: apt.date_time,
        date: apt.date_time.split("T")[0],
        resourceId: String(apt.room_number),
        extendedProps: {
          patient: apt.patient_id,
          doctor: apt.doctor_id,
          urgency: apt.urgency,
        },
      }));
      setEvents(newEvents);
    } catch (error) {
      console.error("Failed to refresh events:", error);
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
  const resources = [
    { id: "1", title: "Room 1" },
    { id: "2", title: "Room 2" },
    { id: "3", title: "Room 3" },
    { id: "4", title: "Room 4" },
    { id: "5", title: "Room 5" },
    { id: "6", title: "Room 6" },
    { id: "7", title: "Room 7" },
  ];
  return (
    <div className="calendar-container">
      {/* ---- Top Navigation ---- */}
      <div className="calendar-header">
        <div className="left-section">
        <button
          className="icon-button"
          onClick={() => setShowFilter(!showFilter)}
        >
          <FaFilter /> Filter <FaCaretDown />
        </button>
        {showFilter && (
          <Filter
            selectedPatients={selectedPatients}  // Pass selected patients to Filter
            selectedCaretakers={selectedCaretakers}  // Pass selected caretakers to Filter
            onClose={() => setShowFilter(false)}
            onFilterChange={handleFilterChange}
          />
        )}

          <button
            className="icon-button"
            onClick={() => setShowProfiles(!showProfiles)}
          >
            <FaUser /> Profiles
          </button>
          {showProfiles && <Profiles onClose={() => setShowProfiles(false)} />}
        </div>
        <div className="right-section">
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
          </div>
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
          <h2
            className="calendar-title"
            dangerouslySetInnerHTML={{ __html: titleText }}
          ></h2>
        </div>
      </div>
      {/* ---- The Calendar ---- */}
      <div className="calendar-wrapper">
        <FullCalendar
          schedulerLicenseKey="GPL-My-Project-Is-Open-Source"
          height="auto"
          aspectRatio={1.2}
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
              expandRows: false,
              // Hide real events (bullets) so we can show "X appointments" ourselves
              eventDisplay: "none",
              // Clicking a day in month view -> switch to day view for that date
              dateClick: (info) => {
                switchToDayView();
                if (calendarRef.current) {
                  calendarRef.current.getApi().gotoDate(info.date);
                }
              },
              dayCellContent: (arg) => {
                const dayNumber = arg.dayNumberText;
                const localDateStr = arg.date.toLocaleDateString("en-CA");
                const dayEvents = events.filter((evt) => {
                  const fixedStart = evt.start.replace(" ", "T");
                  const evtDate = new Date(fixedStart)
                    .toISOString()
                    .split("T")[0];
                  return evtDate === localDateStr;
                });
                // Build custom HTML
                let html = `<div class="custom-day-content">`;
                html += `<div class="fc-daygrid-day-number">${dayNumber}</div>`;
                if (dayEvents.length > 0) {
                  html += `<div class="month-appointments">${dayEvents.length} appointments</div>`;
                }
                html += `</div>`;
                return { html };
              },
              dayCellDidMount: (info) => {
                const overlay = document.createElement("div");
                overlay.className = "day-hover-overlay";

                const icon = document.createElement("div");
                icon.className = "day-hover-icon";
                ReactDOM.createRoot(icon).render(
                  <IoEnterOutline
                    style={{
                      fontSize: "3rem",
                      color: "black",
                    }}
                  />
                );

                overlay.appendChild(icon);
                info.el.appendChild(overlay);
                info.el.style.position = "relative";
              },
            },
            /* =============== DAY VIEW CONFIG =============== */
            resourceTimeGridDay: {
              type: "resourceTimeGridDay",
              allDaySlot: false, // remove the "all‐day" row
              slotMinTime: "09:00:00", // start at 9 AM
              slotMaxTime: "17:00:00", // go until 5 PM
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
                const urgencyColors = {
                  1: "#5EDC74", // green
                  2: "#FFC943", // yellow
                  3: "#DC6D5E", // red
                };
                const backgroundColor =
                  urgencyColors[extendedProps.urgency] || "#d0f0ff"; // fallback

                const handleEventClick = () => {
                  console.log(event.extendedProps.resourceId,event.id);
                  // Open AppointmentPopup and pass the event's appointment data
                  setSelectedSlot({
                    room: event.extendedProps.resourceId, // Room number
                    time: new Date(event.start).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                    appointmentId: event.id, // Pass the appointment ID to edit it
                  });


                };

                return (
                  <div
                    style={{
                      backgroundColor,
                      padding: "5px",
                      borderRadius: "4px",
                      height: "98.5%",
                      border: "1px solid #79747e",
                      position: "relative",
                      overflow: "hidden",
                      cursor: "pointer",
                    }}
                    onClick={handleEventClick} // Add onClick to open the popup
                    onMouseEnter={(e) => {
                      const overlay = e.currentTarget.querySelector(
                        ".event-hover-overlay"
                      );
                      if (overlay) overlay.style.opacity = "1";
                    }}
                    onMouseLeave={(e) => {
                      const overlay = e.currentTarget.querySelector(
                        ".event-hover-overlay"
                      );
                      if (overlay) overlay.style.opacity = "0";
                    }}
                  >
                    <div>
                      <strong>{title}</strong>
                    </div>
                    <div style={{ fontSize: "0.85rem" }}>
                      {extendedProps.patient} w/ {extendedProps.doctor}
                    </div>
                    {/* Hover overlay */}
                    <div
                      className="event-hover-overlay"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(187, 222, 251, 0.8)",
                        opacity: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FaEdit
                        style={{
                          marginLeft: "2.5%",
                          marginBottom: "2.5",
                          fontSize: "2.25rem",
                          color: "black",
                        }}
                      />
                    </div>
                  </div>
                );
              },
            },
          }}
          // Hard-coded rooms 1..7
          resources={resources}
          slotLaneContent={(args) => (
            <div
              style={{
                display: "flex",
                width: "100%",
                height: "100%",
              }}
            >
              {resources.map((resource) => (
                <div className="slot-cell" key={resource.id}>
                  <FiPlusCircle
                    style={{
                      fontSize: "2.25rem",
                      color: "black",
                    }}
                  />
                </div>
              ))}
            </div>
          )}
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
          appointmentId={selectedSlot.appointmentId} // Pass the appointmentId for editing
          onClose={() => setSelectedSlot(null)}
          onAppointmentAdded={refreshEvents}
        />
      )}
    </div>
  );
};
export default CalendarView;
