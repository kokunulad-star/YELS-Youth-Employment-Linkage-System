from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import os, shutil, uuid
from app.database import get_db
from app.models.user import UserRole
from app.models.youth import YouthProfile
from app.models.opportunity import Opportunity
from app.models.application import Application, ApplicationStatusHistory
from app.models.notification import NotificationType
from app.schemas.application import ApplicationStatusUpdate, ApplicationOut
from app.core.security import get_current_user, require_role
from app.core.notifications import create_notification
from app.config import get_settings

settings = get_settings()
router = APIRouter(prefix="/api/applications", tags=["Applications"])

ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB


@router.post("/", response_model=ApplicationOut, status_code=201)
def apply(
    opportunity_id: int = Form(...),
    cover_letter: Optional[str] = Form(None),
    document: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user=Depends(require_role(UserRole.youth)),
):
    profile = db.query(YouthProfile).filter(YouthProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(400, "Complete your youth profile before applying")

    opp = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
    if not opp or opp.status != "open":
        raise HTTPException(404, "Opportunity not found or closed")

    existing = db.query(Application).filter(
        Application.youth_id == profile.id,
        Application.opportunity_id == opportunity_id
    ).first()
    if existing:
        raise HTTPException(400, "You have already applied for this opportunity")

    # Handle document upload
    document_url = None
    if document and document.filename:
        ext = os.path.splitext(document.filename)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(400, "Only PDF, DOC, and DOCX files are allowed")

        # Check file size
        contents = document.file.read()
        if len(contents) > MAX_FILE_SIZE:
            raise HTTPException(400, "File size must not exceed 5 MB")
        document.file.seek(0)

        filename = f"app_{current_user.id}_{uuid.uuid4().hex}{ext}"
        dest_dir = os.path.join(settings.UPLOAD_DIR, "documents")
        os.makedirs(dest_dir, exist_ok=True)
        dest = os.path.join(dest_dir, filename)
        with open(dest, "wb") as f:
            shutil.copyfileobj(document.file, f)
        document_url = f"/uploads/documents/{filename}"

    app = Application(
        youth_id=profile.id,
        opportunity_id=opportunity_id,
        cover_letter=cover_letter,
        document_url=document_url,
    )
    db.add(app)
    db.commit()
    db.refresh(app)

    # Notify the poster
    create_notification(
        db,
        user_id=opp.posted_by,
        title="New Application Received",
        message=f"A new application was submitted for '{opp.title}'",
        ntype=NotificationType.application_update,
        related_id=app.id,
    )
    return app


@router.get("/my", response_model=List[ApplicationOut])
def my_applications(
    db: Session = Depends(get_db),
    current_user=Depends(require_role(UserRole.youth)),
):
    profile = db.query(YouthProfile).filter(YouthProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(404, "Profile not found")
    return db.query(Application).filter(Application.youth_id == profile.id).all()


@router.get("/opportunity/{opp_id}", response_model=List[ApplicationOut])
def applications_for_opportunity(
    opp_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(UserRole.investor, UserRole.organization, UserRole.admin)),
):
    opp = db.query(Opportunity).filter(Opportunity.id == opp_id).first()
    if not opp:
        raise HTTPException(404, "Opportunity not found")
    if current_user.role != UserRole.admin and opp.posted_by != current_user.id:
        raise HTTPException(403, "Not authorized")
    return db.query(Application).filter(Application.opportunity_id == opp_id).all()


@router.patch("/{app_id}/status", response_model=ApplicationOut)
def update_status(
    app_id: int,
    payload: ApplicationStatusUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(UserRole.investor, UserRole.organization, UserRole.admin)),
):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(404, "Application not found")

    opp = db.query(Opportunity).filter(Opportunity.id == app.opportunity_id).first()
    if current_user.role != UserRole.admin and opp.posted_by != current_user.id:
        raise HTTPException(403, "Not authorized")

    history = ApplicationStatusHistory(
        application_id=app.id,
        old_status=app.status,
        new_status=payload.status,
        changed_by=current_user.id,
        note=payload.note,
    )
    db.add(history)
    app.status = payload.status
    db.commit()
    db.refresh(app)

    youth_user_id = app.youth.user_id
    create_notification(
        db,
        user_id=youth_user_id,
        title="Application Status Updated",
        message=f"Your application for '{opp.title}' is now: {payload.status.value}",
        ntype=NotificationType.application_update,
        related_id=app.id,
    )
    return app


@router.get("/{app_id}", response_model=ApplicationOut)
def get_application(
    app_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(404, "Application not found")

    if current_user.role == UserRole.youth:
        profile = db.query(YouthProfile).filter(YouthProfile.user_id == current_user.id).first()
        if not profile or app.youth_id != profile.id:
            raise HTTPException(403, "Not authorized")

    return app
