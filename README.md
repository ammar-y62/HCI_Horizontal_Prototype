# Medical Clinic Scheduling Tool

A small web application to manage medical clinic schedules, built with a Flask backend and a React frontend (located in the "dashboard" folder).

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

The Medical Clinic Scheduling Tool provides a calendar-based interface to manage appointments and scheduling for a medical clinic. The backend is powered by Flask, while the frontend is built using React. This repository contains both the backend code and the frontend code in the "dashboard" folder.

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
