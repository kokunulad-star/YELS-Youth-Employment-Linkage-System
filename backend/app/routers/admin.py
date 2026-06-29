from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User, UserRole
from app.models.youth import Skill, YouthProfile
from app.models.opportunity import Opportunity
from app.models.application import Application, ApplicationStatusHistory, ApplicationStatus
from app.schemas.youth import SkillBase, SkillOut
from app.schemas.opportunity import OpportunityIn, OpportunityOut
from app.schemas.application import ApplicationOut, ApplicationStatusUpdate
from app.core.security import require_role
from app.core.notifications import create_notification
from app.core.email import send_application_result_email
from app.models.notification import NotificationType
import asyncio
router = APIRouter(prefix="/api/admin", tags=["Admin"])


# ── Users ────────────────────────────────────────────────────────────────────

@router.get("/users")
def list_users(
    db: Session = Depends(get_db),
    _=Depends(require_role(UserRole.admin)),
):
    return db.query(User).all()


@router.patch("/users/{user_id}/deactivate", status_code=204)
def deactivate_user(
    user_id: int,
    db: Session = Depends(get_db),
    _=Depends(require_role(UserRole.admin)),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")
    user.is_active = False
    db.commit()


@router.patch("/users/{user_id}/activate", status_code=204)
def activate_user(
    user_id: int,
    db: Session = Depends(get_db),
    _=Depends(require_role(UserRole.admin)),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")
    user.is_active = True
    db.commit()


# ── Skills Management ────────────────────────────────────────────────────────

@router.get("/skills", response_model=List[SkillOut])
def list_skills(
    db: Session = Depends(get_db),
    _=Depends(require_role(UserRole.admin)),
):
    return db.query(Skill).all()


@router.post("/skills", response_model=SkillOut, status_code=201)
def create_skill(
    payload: SkillBase,
    db: Session = Depends(get_db),
    _=Depends(require_role(UserRole.admin)),
):
    existing = db.query(Skill).filter(Skill.name == payload.name).first()
    if existing:
        raise HTTPException(400, "Skill already exists")
    skill = Skill(name=payload.name)
    db.add(skill)
    db.commit()
    db.refresh(skill)
    return skill


@router.delete("/skills/{skill_id}", status_code=204)
def delete_skill(
    skill_id: int,
    db: Session = Depends(get_db),
    _=Depends(require_role(UserRole.admin)),
):
    skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(404, "Skill not found")
    db.delete(skill)
    db.commit()


# ── Opportunities Management ─────────────────────────────────────────────────

@router.get("/opportunities", response_model=List[OpportunityOut])
def list_all_opportunities(
    db: Session = Depends(get_db),
    _=Depends(require_role(UserRole.admin)),
):
    return db.query(Opportunity).order_by(Opportunity.created_at.desc()).all()


@router.post("/opportunities", response_model=OpportunityOut, status_code=201)
def admin_create_opportunity(
    payload: OpportunityIn,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(UserRole.admin)),
):
    from app.models.opportunity import OpportunitySkill
    from app.models.youth import Skill as SkillModel
    skill_ids = payload.skill_ids
    opp_data = payload.model_dump(exclude={"skill_ids"})
    # Admin always posts to Dar es Salaam
    opp_data["location"] = "Dar es Salaam"
    opp = Opportunity(posted_by=current_user.id, **opp_data)
    db.add(opp)
    db.flush()
    for sid in skill_ids:
        skill = db.query(SkillModel).filter(SkillModel.id == sid).first()
        if not skill:
            raise HTTPException(404, f"Skill id {sid} not found")
        db.add(OpportunitySkill(opportunity_id=opp.id, skill_id=sid))
    db.commit()
    db.refresh(opp)
    return opp


@router.patch("/opportunities/{opp_id}/close", status_code=204)
def close_opportunity(
    opp_id: int,
    db: Session = Depends(get_db),
    _=Depends(require_role(UserRole.admin)),
):
    opp = db.query(Opportunity).filter(Opportunity.id == opp_id).first()
    if not opp:
        raise HTTPException(404, "Opportunity not found")
    opp.status = "closed"
    db.commit()


@router.patch("/opportunities/{opp_id}/open", status_code=204)
def reopen_opportunity(
    opp_id: int,
    db: Session = Depends(get_db),
    _=Depends(require_role(UserRole.admin)),
):
    opp = db.query(Opportunity).filter(Opportunity.id == opp_id).first()
    if not opp:
        raise HTTPException(404, "Opportunity not found")
    opp.status = "open"
    db.commit()


@router.delete("/opportunities/{opp_id}", status_code=204)
def admin_delete_opportunity(
    opp_id: int,
    db: Session = Depends(get_db),
    _=Depends(require_role(UserRole.admin)),
):
    opp = db.query(Opportunity).filter(Opportunity.id == opp_id).first()
    if not opp:
        raise HTTPException(404, "Opportunity not found")
    db.delete(opp)
    db.commit()


# ── Applications Management ───────────────────────────────────────────────────

@router.get("/applications", response_model=List[ApplicationOut])
def list_all_applications(
    db: Session = Depends(get_db),
    _=Depends(require_role(UserRole.admin)),
):
    return db.query(Application).order_by(Application.applied_at.desc()).all()


@router.patch("/applications/{app_id}/approve", response_model=ApplicationOut)
def approve_application(
    app_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(UserRole.admin)),
):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(404, "Application not found")

    history = ApplicationStatusHistory(
        application_id=app.id,
        old_status=app.status,
        new_status=ApplicationStatus.accepted,
        changed_by=current_user.id,
        note="Approved by admin",
    )
    db.add(history)
    app.status = ApplicationStatus.accepted
    db.commit()
    db.refresh(app)

    opp = db.query(Opportunity).filter(Opportunity.id == app.opportunity_id).first()
    youth_user = db.query(User).filter(User.id == app.youth.user_id).first()
    youth_name = f"{app.youth.first_name} {app.youth.last_name}"

    create_notification(
        db,
        user_id=app.youth.user_id,
        title="Application Approved 🎉",
        message=f"Your application for '{opp.title}' has been approved!",
        ntype=NotificationType.application_update,
        related_id=app.id,
    )

    background_tasks.add_task(
        send_application_result_email,
        recipient_email=youth_user.email,
        recipient_name=youth_name,
        opportunity_title=opp.title,
        accepted=True,
    )
    return app


@router.patch("/applications/{app_id}/reject", response_model=ApplicationOut)
def reject_application(
    app_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(UserRole.admin)),
):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(404, "Application not found")

    history = ApplicationStatusHistory(
        application_id=app.id,
        old_status=app.status,
        new_status=ApplicationStatus.rejected,
        changed_by=current_user.id,
        note="Rejected by admin",
    )
    db.add(history)
    app.status = ApplicationStatus.rejected
    db.commit()
    db.refresh(app)

    opp = db.query(Opportunity).filter(Opportunity.id == app.opportunity_id).first()
    youth_user = db.query(User).filter(User.id == app.youth.user_id).first()
    youth_name = f"{app.youth.first_name} {app.youth.last_name}"

    create_notification(
        db,
        user_id=app.youth.user_id,
        title="Application Update",
        message=f"Your application for '{opp.title}' was not successful this time.",
        ntype=NotificationType.application_update,
        related_id=app.id,
    )

    background_tasks.add_task(
        send_application_result_email,
        recipient_email=youth_user.email,
        recipient_name=youth_name,
        opportunity_title=opp.title,
        accepted=False,
    )
    return app
