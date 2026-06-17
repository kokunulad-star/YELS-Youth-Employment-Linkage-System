from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.youth import Skill
from app.schemas.youth import SkillOut
from app.core.security import get_current_user

router = APIRouter(prefix="/api/skills", tags=["Skills"])


@router.get("/", response_model=List[SkillOut])
def list_skills(
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    """Public (authenticated) endpoint — returns all available skills for dropdowns."""
    return db.query(Skill).order_by(Skill.name).all()
