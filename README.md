# YELS – Youth Employment Linkage System

A full-stack web platform that connects youth with employment, investment, training, and entrepreneurship opportunities in Ethiopia.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8, React Router v7, Zustand, Axios, Tailwind-like CSS |
| Backend | Python 3.11, FastAPI 0.111, SQLAlchemy 2, Alembic, PyMySQL |
| Database | MySQL 8.4 |
| Auth | JWT (python-jose), bcrypt (passlib) |

---

## Project Structure

```
YELS-Youth-Employment-Linkage-System/
├── backend/            # FastAPI REST API
├── frontend/           # React + Vite SPA
├── db/
│   └── schema.sql      # Raw SQL schema reference
└── docs/               # Project proposal documents
```

---

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- MySQL 8.4

### 1. Database
```sql
CREATE DATABASE yels_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
copy .env.example .env         # Edit DATABASE_URL and SECRET_KEY
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev                    # Runs on http://localhost:3000
```

### 4. Access
| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| Swagger UI | http://localhost:8000/docs |
| ReDoc | http://localhost:8000/redoc |

---

## User Roles

| Role | Description |
|---|---|
| `youth` | Registers, builds a profile, applies for opportunities |
| `organization` | Posts job/training opportunities, reviews applications |
| `investor` | Posts funding/investment opportunities |
| `admin` | Full platform access — manages users, skills, content |

---

## API Overview

Base URL: `http://localhost:8000/api`

| Tag | Prefix | Description |
|---|---|---|
| Auth | `/api/auth` | Register, login, current user |
| Youth | `/api/youth` | Profile, education, skills, CV upload |
| Profiles | `/api/profiles` | Organization & investor profiles |
| Opportunities | `/api/opportunities` | CRUD for job/funding/training posts |
| Applications | `/api/applications` | Apply, track, update status |
| Messages | `/api/messages` | Conversations & messaging |
| Notifications | `/api/notifications` | In-app notifications |
| Skills | `/api/skills` | Public skills list |
| Admin | `/api/admin` | User management, skills management |

Full interactive docs at **http://localhost:8000/docs**

---

## Environment Variables (backend/.env)

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | MySQL connection string | `mysql+pymysql://root:@localhost:3306/yels_db` |
| `SECRET_KEY` | JWT signing key — change in production | — |
| `ALGORITHM` | JWT algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token lifetime (minutes) | `60` |
| `UPLOAD_DIR` | Folder for uploaded files | `uploads` |
