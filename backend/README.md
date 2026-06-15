# YELS Backend – FastAPI

## Setup

### 1. Create and activate a virtual environment
```bash
python -m venv venv
venv\Scripts\activate        # Windows
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure environment
```bash
copy .env.example .env
# Edit .env with your MySQL credentials and a strong SECRET_KEY
```

### 4. Create the database
Run the schema file in MySQL:
```bash
mysql -u root -p < ../db/schema.sql
```

### 5. Run the development server
```bash
uvicorn app.main:app --reload --port 8000
```

### 6. API Docs
- Swagger UI: http://localhost:8000/docs
- ReDoc:       http://localhost:8000/redoc

---

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app entry point
│   ├── config.py            # Settings (env vars)
│   ├── database.py          # SQLAlchemy engine & session
│   ├── core/
│   │   ├── security.py      # JWT auth, password hashing, role guards
│   │   └── notifications.py # Notification helper
│   ├── models/              # SQLAlchemy ORM models
│   │   ├── user.py
│   │   ├── youth.py
│   │   ├── investor.py
│   │   ├── organization.py
│   │   ├── opportunity.py
│   │   ├── application.py
│   │   ├── notification.py
│   │   └── message.py
│   ├── schemas/             # Pydantic request/response schemas
│   │   ├── auth.py
│   │   ├── youth.py
│   │   ├── investor.py
│   │   ├── organization.py
│   │   ├── opportunity.py
│   │   ├── application.py
│   │   ├── notification.py
│   │   └── message.py
│   └── routers/             # API route handlers
│       ├── auth.py
│       ├── youth.py
│       ├── profiles.py
│       ├── opportunities.py
│       ├── applications.py
│       ├── notifications.py
│       ├── messages.py
│       └── admin.py
├── alembic.ini
├── requirements.txt
└── .env.example
```

## API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login and get JWT token |
| POST | /api/youth/profile | Create youth profile |
| GET | /api/youth/profile/me | Get my youth profile |
| PUT | /api/youth/profile/me | Update my youth profile |
| GET | /api/youth/search | Search youth by skills/education |
| POST | /api/profiles/organization | Create org profile |
| POST | /api/profiles/investor | Create investor profile |
| GET | /api/opportunities/ | List open opportunities |
| POST | /api/opportunities/ | Post a new opportunity |
| POST | /api/applications/ | Apply for an opportunity |
| GET | /api/applications/my | My applications |
| PATCH | /api/applications/{id}/status | Update application status |
| GET | /api/notifications/ | Get my notifications |
| POST | /api/messages/ | Send a message |
| GET | /api/messages/conversations | List conversations |
| GET | /api/admin/users | List all users (admin) |
| POST | /api/admin/skills | Add a skill (admin) |
