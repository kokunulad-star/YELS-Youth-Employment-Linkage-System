from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User, UserRole
from app.models.youth import Skill
from app.schemas.youth import SkillBase, SkillOut
from app.core.security import require_role

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
