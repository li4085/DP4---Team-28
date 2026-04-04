# PSUU

Hello and welcome to PSUU! PSUU is a patient and Personal Support Worker scheduling app built for a two-sided care workflow. Patients can sign up, manage scheduled tasks, request help through a queue or emergency queue, view history, and access a map page. PSWs can manage their own accounts, view assigned schedules and history, respond to incoming queue requests, and use map-based routing tools. We hope you enjoy!

## Tech Stack

- Frontend: React, Vite, React Router, Leaflet, React Leaflet, Nominatim API (OpenStreetMap's geocoder)
- Backend: FastAPI, SQLModel, Uvicorn
- Database: SQLite

## Main Features

- Shared authentication flow for both patients and PSWs
- Patient and PSW sign-up with role-specific profile fields
- Patient scheduling tools for creating, completing, and cancelling care tasks
- Task history tracking for both patients and PSWs
- Patient help queue with normal and emergency priority requests
- PSW queue dashboard for handling pending and emergency requests
- Profile settings pages for both roles
- Map pages using Leaflet with route display support

## Repository Structure

```text
DP4---Team-28/
├── README.md
├── package.json
├── front-end/
│   ├── package.json
│   ├── setup.md
│   ├── public/
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       └── pages/
│           ├── Login.jsx
│           ├── Signup.jsx
│           ├── patient/
│           └── psw/
└── back-end/
    ├── requirements.txt
    ├── setup.md
    └── app/
        ├── main.py
        ├── database.py
        ├── models.py
        └── routers/
```

## Local Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd DP4---Team-28
```

### 2. Start the backend

```bash
cd back-end
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The backend will run at:

```text
http://localhost:8000
```

FastAPI docs will be available at:

```text
http://localhost:8000/docs
```

### 3. Start the frontend

Open a second terminal:

```bash
cd front-end
npm install
npm run dev
```

The frontend will usually run at:

```text
http://localhost:5173
```

## Example Workflow

1. Create a PSW account.
2. Create a patient account and assign it to that PSW using the PSW username.
3. Log in as a patient to create schedule items or request help through the queue.
4. Log in as a PSW to view assigned work, queue requests, and emergency alerts.

## Notes

- Session tokens are stored in memory on the backend, so active sessions are cleared when the server restarts.
- The app uses a local SQLite database that is created automatically when the backend starts.
- The map pages use browser geolocation and OpenStreetMap-based services, so location permission and internet access are needed for full map functionality.

## Team

This repository is for Team 28's DP4 project. 

Team 28: Michael Wen, Alysha Crane, Alex D'Silva-Peters, Meng Bai Li. 
