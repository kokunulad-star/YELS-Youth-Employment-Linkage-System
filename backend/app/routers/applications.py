from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import UserRole
from app.models.youth import YouthProfile
from app.models.opportunity import Opportunity
from app.models.application import Application, ApplicationStatusHistory
from app.models.notification import NotificationType
from app.schemas.application import ApplicationIn, ApplicationStatusUpdate, ApplicationOut
from app.core.security import get_current_user, require_role
from app.core.notifications import create_notification

router = APIRouter(prefix="/api/applications", tags=["Applications"])


@router.post("/", response_model=ApplicationOut, status_code=201)
def apply(
    payload: ApplicationIn,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(UserRole.youth)),
):
    profile = db.query(YouthProfile).filter(YouthProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(400, "Complete your youth profile before applying")

    opp = db.query(Opportunity).filter(Opportunity.id == payload.opportunity_id).first()
    if not opp or opp.status != "open":
        raise HTTPException(404, "Opportunity not found or closed")

    existing = db.query(Application).filter(
        Application.youth_id == profile.id,
        Application.opportunity_id == payload.opportunity_id
    ).first()
    if existing:
        raise HTTPException(400, "You have already applied for this opportunity")

    app = Application(
        youth_id=profile.id,
        opportunity_id=payload.opportunity_id,
        cover_letter=payload.cover_letter,
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

    # Record history
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

    # Notify the youth applicant
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

    # Youth can only see their own; poster or admin can see any
    if current_user.role == UserRole.youth:
        profile = db.query(YouthProfile).filter(YouthProfile.user_id == current_user.id).first()
        if not profile or app.youth_id != profile.id:
            raise HTTPException(403, "Not authorized")

    return app
