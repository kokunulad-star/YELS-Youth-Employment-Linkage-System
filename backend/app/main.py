from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.database import Base, engine
from app.config import get_settings

# Import all models so SQLAlchemy registers them before create_all
import app.models  # noqa: F401

from app.routers import auth, youth, profiles, opportunities, applications, notifications, messages, admin, skills, payments

settings = get_settings()

# Create tables (use Alembic migrations in production)
Base.metadata.create_all(bind=engine)

# Ensure upload directories exist
for folder in ["cvs", "photos", "logos"]:
    os.makedirs(os.path.join(settings.UPLOAD_DIR, folder), exist_ok=True)

app = FastAPI(
    title="YELS – Youth Investment, Entrepreneurship & Employment Linkage System",
    version="1.0.0",
    description="API for connecting youth with employment, investment, and training opportunities.",
)

# CORS – allow React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded files as static
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Register routers
app.include_router(auth.router)
app.include_router(youth.router)
app.include_router(profiles.router)
app.include_router(opportunities.router)
app.include_router(applications.router)
app.include_router(notifications.router)
app.include_router(messages.router)
app.include_router(skills.router)
app.include_router(admin.router)
app.include_router(payments.router)


@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "system": "YELS API"}
