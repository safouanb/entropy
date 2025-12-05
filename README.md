# SF Data Map Explorer

Interactive web application for visualizing San Francisco's district heating infrastructure and data centers.

## Features

- Interactive 3D map of San Francisco
- Real-time monitoring of heat centers and demand sites
- Statistics dashboard with live metrics
- Data center heat recovery analysis
- Distribution network visualization

## Tech Stack

**Frontend:** React, TypeScript, Vite, Tailwind CSS, MapLibre GL JS
**Backend:** FastAPI, SQLAlchemy, SQLite

## Setup

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Access the app at http://localhost:8080

## Project Structure

```
sf-datamap-explorer/
├── backend/
│   ├── app.py
│   ├── models.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── types/
│   └── package.json
└── README.md
```