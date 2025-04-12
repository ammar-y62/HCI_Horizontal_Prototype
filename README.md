# Medical Clinic Scheduling Tool

A small web application to manage medical clinic schedules, built with a Flask backend and a React frontend (located in the "dashboard" folder).

## Contributors

- **Ammar Elzeftawy** - [ammar.elzeftawy1@ucalgary.ca](mailto:ammar.elzeftawy1@ucalgary.ca)
- **Christopher Axten** - [christopher.axten@ucalgary.ca](mailto:christopher.axten@ucalgary.ca)
- **Austin Lee** - [austin.lee1@ucalgary.ca](mailto:austin.lee1@ucalgary.ca)
- **Andy Huynh** - [andy.huynh2@ucalgary.ca](mailto:andy.huynh2@ucalgary.ca)
- **Tavish Handa** - [tavish.handa@ucalgary.ca](mailto:tavish.handa@ucalgary.ca)

## Table of Contents

- [Project Overview](#project-overview)
- [System Requirements](#system-requirements)
- [Project Setup](#project-setup)
  - [Backend Setup (Flask)](#backend-setup-flask)
  - [Frontend Setup (React)](#frontend-setup-react)
  - [VS Code Run Tasks](#vs-code-run-tasks)
- [Running the Application](#running-the-application)
  - [Starting the Backend (Flask)](#starting-the-backend-flask)
  - [Starting the Frontend (React)](#starting-the-frontend-react)
- [Troubleshooting](#troubleshooting)
- [Future Enhancements](#future-enhancements)

## Project Overview

This project allows you to:

- **View all scheduled appointments in Month View:** Each day in the calendar shows a count of scheduled appointments. When any filters are applied (e.g., by patient or caretaker), the daily counts dynamically update to display only the appointments matching those filters.
- **Switch between Month and Day views:**
  - **Month View:** Displays a calendar grid with the current month and highlights the total appointments each day.
  - **Day View:** Displays a time-and-room grid for the currently selected date.
- **Manage Appointments:** Create, edit, or delete appointments by clicking on time slots.
- **Filter Appointments:** Use various filtering criteria (e.g., by patient or caretaker) to adjust the appointments displayed.
- **Manage Patient and Caretaker Profiles:** Add, view, update, and delete profiles with relevant information.

---

## Key Features / Cases Implemented

1. **Month View**

   - Displays all days of the current month.
   - Shows the total number of scheduled appointments per day.
   - Navigation:
     - Use the left and right arrow keys or the on-screen arrow buttons to move to the previous or next month.
     - Press **m** to switch to Month View (if currently in Day View).

2. **Day View**

   - Shows a grid where columns are **room numbers** and rows represent **hourly time slots** (e.g., 9 AM to 5 PM).
   - Navigation:
     - Use the left and right arrow keys or the on-screen arrow buttons to move to the previous or next day.
     - Press **d** to switch to Day View for the currently selected date.
   - The currently selected date is highlighted in Month View (today’s date is highlighted yellow by default).

3. **Hover Effects in Month View**

   - Hovering over a day slot triggers a blue, highlighted overlay with an enter icon, indicating that clicking will switch to the Day View for that date.
   - The mouse cursor becomes a pointer when hovering over a day slot.

4. **Hover Effects in Day View**

   - Hovering over an appointment slot adds a blue, transparent overlay which shifts the slot’s content into the background.
   - For an empty appointment slot, a plus symbol appears, indicating that clicking will create a new appointment.
   - For a filled appointment slot, an edit symbol appears, indicating that clicking will edit the existing appointment.
   - The mouse cursor becomes a pointer on hover.

5. **Filter Menu**

   - Click on the **Filter** button or press **f** to open the filter categories menu.
   - Each filter category displays a list of potential filtering options with an integrated search bar.
   - When a filter criterion is selected:
     - The corresponding filter button changes its appearance (e.g., the box fills with blue and shows a checkmark).
     - The **Filter** button turns orange to indicate active filtering.
   - Filtered-out appointments in the Day View appear with reduced opacity (transparent), but are still visible.
   - Use the **Clear Filters** option to deselect all active filters and display all appointments normally.

6. **Appointment Creation Dialog Popup (Day View Schedule)**

   - Clicking on an appointment slot opens a central dialog popup with a faded background.
   - The popup displays the room and time of the slot.
   - For empty slots, default values (e.g., “Unassigned”) appear for the patient and caretaker.
   - For existing appointments, the popup pre-fills with existing appointment data and includes a delete button.
   - Patient and Caretaker selection fields include a searchable dropdown list.
   - Hovering over a profile or selected profile shows a summary popup with more details.
   - Pressing the **Clear** button resets the fields to default values.
   - The **Save** button remains disabled unless both the patient and caretaker fields are assigned.

7. **Appointment Editing Dialog Popup (Day View Schedule)**

   - Similar to the creation dialog but pre-populated with existing appointment data.
   - Includes functionality for editing and deleting an appointment.

8. **Patient Profile Management Dialog Pages**

   - **Add:** Press the add button to open a page for creating a new patient profile.
   - **View:** Use the view button to browse or search for existing patient profiles.
   - **Edit:** Clicking on a patient profile displays their details for editing.
   - **Remove:** A remove button allows deleting a patient profile from the system.

9. **Caretaker Profile Management Dialog Pages**
   - **Add:** Press the add button to open a page for creating a new caretaker profile.
   - **View:** Use the view button to browse or search for existing caretaker profiles.
   - **Edit:** Clicking on a caretaker profile shows their details for editing.
   - **Remove:** A remove button allows deleting a caretaker profile from the system.

---

## Data Entry Guide (What Data Goes Where and When)

1. **Before Scheduling Appointments:**

   - Add new patient and caretaker profiles using the profile management dialogs. This ensures they appear in the selection dropdown in the appointment creation dialog.

2. **When Creating/Editing an Appointment:**

   - **Patient:** Must be selected (required).
   - **Caretaker:** Must be selected (required).
   - **Room:** Determined by the time slot clicked in Day View.
   - **Date and Time:** Automatically set based on the selected slot.

3. **Using Filters:**
   - Select which patient(s) and/or caretaker(s) to filter appointments.
   - The count of appointments displayed (e.g., on each day in Month View) updates to reflect the filtering criteria.

---

## Exact Walkthrough (Step-by-Step Instructions)

1. **Launching the App:**

   - Open your browser and navigate to [https://tavishhanda.github.io/HCI_Horizontal_Prototype/](https://tavishhanda.github.io/HCI_Horizontal_Prototype/), or you can follow the steps in [Project Setup](#project-setup) and set up the environment locally.

2. **Navigating Month View:**

   - The app opens in Month View with today’s date highlighted.
   - Hover over any day slot to see a blue overlay with an enter icon, indicating that clicking will switch to the Day View for that day.
   - Use the left/right arrow buttons or arrow keys to navigate to previous/next months.

3. **Switching to Day View:**

   - Click the **Day** toggle button in the top toolbar, or press **d**.
   - The Day View grid appears with room numbers as columns and hourly slots as rows.

4. **Creating/Editing an Appointment:**

   - In Day View, hover over an empty slot to display a plus icon and click to open the appointment creation dialog.
   - For an existing appointment, click the slot (it shows an edit icon on hover) to open the editing dialog.
   - Fill in or update the appointment details, then click **Save** (or **Delete** for removal).

5. **Applying Filters:**

   - Click the **Filter** button or press **f** to open the filter menu.
   - Select/deselect filtering criteria for patients or caretakers.
   - Observe that the appointment counts update dynamically in the Month View and filtered-out appointments appear transparent.

6. **Managing Profiles:**
   - Click the **Profiles** button in the top toolbar.
   - Use the provided dialogs to add, view, edit, or remove patient and caretaker profiles.
   - Newly added profiles will be available when creating or editing appointments.

**Keyboard Shortcuts:**

- Switch to Month View: M
- Switch to Day View: D
- Previous Month/Day: Left Arrow
- Next Month/Day: Right Arrow
- Open Filter Popup: F
- Open Profile Popup: P
- Close Popup: Esc

**Video Presentation:**

[![Presentation Video](https://img.youtube.com/vi/VIDEO_ID/0.jpg)](https://youtu.be/Mp1PNabv4pA)

---

## System Requirements

Before setting up the project, ensure you have installed:

- **Python 3.7+**: [Download Python](https://www.python.org/downloads/)
- **Node.js & npm**: [Download Node.js](https://nodejs.org/)
- **Git**: [Download Git](https://git-scm.com/downloads/)
- **VS Code**: [Download VS Code](https://code.visualstudio.com/)

## Project Setup

### 1. Clone the Repository

Clone the repository using Git:

```bash
git clone https://github.com/your-username/HCI_HORIZONTAL_PROTOTYPE.git
```

Then navigate to the project directory:

```bash
cd HCI_HORIZONTAL_PROTOTYPE
```

### 2. Backend Setup (Flask)

#### Create a Virtual Environment

In the project root (where `app.py` and `requirements.txt` are located), create and activate a virtual environment:

```bash
# For Windows
python -m venv venv
.\venv\Scripts\activate

# For macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### Install Python Dependencies

With the virtual environment activated, install the required packages:

```bash
pip install -r requirements.txt
```

#### Review the Backend Code

Open `app.py` to review the basic Flask setup.

### 3. Frontend Setup (React - "dashboard")

#### Navigate to the Dashboard Folder

The React app is located in the `dashboard` folder:

```bash
cd dashboard
```

#### Install npm Dependencies

Install the necessary packages for the React app:

```bash
npm install
```

#### Review the Frontend Code

The main React code is in `src/App.js`, which currently displays a calendar placeholder and fetches a test message from the Flask backend.

### 4. VS Code Run Tasks

The project includes VS Code tasks to run the backend and frontend directly from the editor. In the `.vscode/tasks.json` file, you’ll find tasks configured for:

- **Run Backend**: Starts the Flask server.
- **Run Frontend**: Starts the React development server (inside the `dashboard` folder).
- **Run Both**: A compound task that launches both servers simultaneously.

To use these tasks:

1. Open VS Code in the project directory.
2. Open the Command Palette (`Ctrl+Shift+P` on Windows or `Cmd+Shift+P` on macOS).
3. Select **Tasks: Run Task**.
4. Choose **Run Backend**, **Run Frontend**, or **Run Both**.

## Running the Application

### Starting the Backend (Flask)

With your virtual environment activated, start the Flask server by running:

```bash
python app.py
```

Alternatively, use the **Run Backend** task in VS Code. The Flask app will be available at [http://127.0.0.1:5000](http://127.0.0.1:5000).

### Starting the Frontend (React)

Navigate to the `dashboard` folder and start the React app:

```bash
npm start
```

Or use the **Run Frontend** task in VS Code. The React app will launch at [http://localhost:3000](http://localhost:3000).

## Troubleshooting

### Too Many Unstaged Files:

Ensure that your `.gitignore` file includes the following entries:

```gitignore
# Node modules
dashboard/node_modules/

# Python virtual environment
venv/

# VS Code settings (optional)
.vscode/tasks.json
```

### Virtual Environment Issues:

Always activate your virtual environment before installing dependencies or running the backend.

### Dependency Errors:

Verify your package versions by checking `requirements.txt` for the backend and `package.json` for the frontend. If you encounter errors, try reinstalling the dependencies.

## Future Enhancements

### Feature Expansion:

- Add more scheduling features, user authentication, and extended calendar functionality.

### Database Integration:

- Connect a database (e.g., SQLite, PostgreSQL) for persistent data storage.

### UI Improvements:

- Integrate a robust calendar library, such as `react-big-calendar`, for enhanced scheduling UI.

Happy coding and enjoy building the **Medical Clinic Scheduling Tool**!
