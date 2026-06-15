from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import os, shutil, uuid
from app.database import get_db
from app.models.youth import YouthProfile, YouthEducation, Skill, YouthSkill
from app.models.user import UserRole
from app.schemas.youth import (
    YouthProfileIn, YouthProfileUpdate, YouthProfileOut,
    EducationIn, EducationOut,
    YouthSkillIn, YouthSkillOut, SkillOut
)
from app.core.security import get_current_user, require_role
from app.config import get_settings

settings = get_settings()
router = APIRouter(prefix="/api/youth", tags=["Youth"])


# ── Profile ─────────────────────────────────────────────────────────────────

@router.post("/profile", response_model=YouthProfileOut, status_code=201)
def create_profile(
    payload: YouthProfileIn,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(UserRole.youth)),
):
    if db.query(YouthProfile).filter(YouthProfile.user_id == current_user.id).first():
        raise HTTPException(400, "Profile already exists")
    profile = YouthProfile(user_id=current_user.id, **payload.model_dump())
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


@router.get("/profile/me", response_model=YouthProfileOut)
def get_my_profile(
    db: Session = Depends(get_db),
    current_user=Depends(require_role(UserRole.youth)),
):
    profile = db.query(YouthProfile).filter(YouthProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(404, "Profile not found")
    return profile


@router.get("/profile/{profile_id}", response_model=YouthProfileOut)
def get_profile(profile_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    profile = db.query(YouthProfile).filter(YouthProfile.id == profile_id).first()
    if not profile:
        raise HTTPException(404, "Profile not found")
    return profile


@router.put("/profile/me", response_model=YouthProfileOut)
def update_profile(
    payload: YouthProfileUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(UserRole.youth)),
):
    profile = db.query(YouthProfile).filter(YouthProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(404, "Profile not found")
    for k, v in payload.model_dump(exclude_none=True).items():
        setattr(profile, k, v)
    db.commit()
    db.refresh(profile)
    return profile


# ── CV & Photo Upload ────────────────────────────────────────────────────────

@router.post("/profile/me/upload-cv")
def upload_cv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(require_role(UserRole.youth)),
):
    profile = db.query(YouthProfile).filter(YouthProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(404, "Profile not found")
    ext = os.path.splitext(file.filename)[1]
    filename = f"cv_{current_user.id}_{uuid.uuid4().hex}{ext}"
    dest = os.path.join(settings.UPLOAD_DIR, "cvs", filename)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    with open(dest, "wb") as f:
        shutil.copyfileobj(file.file, f)
    profile.cv_url = dest
    db.commit()
    return {"cv_url": dest}


@router.post("/profile/me/upload-photo")
def upload_photo(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(require_role(UserRole.youth)),
):
    profile = db.query(YouthProfile).filter(YouthProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(404, "Profile not found")
    ext = os.path.splitext(file.filename)[1]
    filename = f"photo_{current_user.id}_{uuid.uuid4().hex}{ext}"
    dest = os.path.join(settings.UPLOAD_DIR, "photos", filename)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    with open(dest, "wb") as f:
        shutil.copyfileobj(file.file, f)
    profile.profile_photo_url = dest
    db.commit()
    return {"profile_photo_url": dest}


# ── Education ────────────────────────────────────────────────────────────────

@router.post("/profile/me/education", response_model=EducationOut, status_code=201)
def add_education(
    payload: EducationIn,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(UserRole.youth)),
):
    profile = db.query(YouthProfile).filter(YouthProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(404, "Profile not found")
    edu = YouthEducation(youth_id=profile.id, **payload.model_dump())
    db.add(edu)
    db.commit()
    db.refresh(edu)
    return edu


@router.delete("/profile/me/education/{edu_id}", status_code=204)
def delete_education(
    edu_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(UserRole.youth)),
):
    profile = db.query(YouthProfile).filter(YouthProfile.user_id == current_user.id).first()
    edu = db.query(YouthEducation).filter(
        YouthEducation.id == edu_id,
        YouthEducation.youth_id == profile.id
    ).first()
    if not edu:
        raise HTTPException(404, "Education record not found")
    db.delete(edu)
    db.commit()


# ── Skills ───────────────────────────────────────────────────────────────────

@router.post("/profile/me/skills", status_code=201)
def add_skill(
    payload: YouthSkillIn,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(UserRole.youth)),
):
    profile = db.query(YouthProfile).filter(YouthProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(404, "Profile not found")
    skill = db.query(Skill).filter(Skill.id == payload.skill_id).first()
    if not skill:
        raise HTTPException(404, "Skill not found")
    existing = db.query(YouthSkill).filter(
        YouthSkill.youth_id == profile.id,
        YouthSkill.skill_id == payload.skill_id
    ).first()
    if existing:
        raise HTTPException(400, "Skill already added")
    ys = YouthSkill(youth_id=profile.id, skill_id=payload.skill_id, level=payload.level)
    db.add(ys)
    db.commit()
    return {"message": "Skill added"}


@router.delete("/profile/me/skills/{skill_id}", status_code=204)
def remove_skill(
    skill_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(UserRole.youth)),
):
    profile = db.query(YouthProfile).filter(YouthProfile.user_id == current_user.id).first()
    ys = db.query(YouthSkill).filter(
        YouthSkill.youth_id == profile.id,
        YouthSkill.skill_id == skill_id
    ).first()
    if not ys:
        raise HTTPException(404, "Skill not found on profile")
    db.delete(ys)
    db.commit()


# ── Search Youth ─────────────────────────────────────────────────────────────

@router.get("/search", response_model=List[YouthProfileOut])
def search_youth(
    skills: Optional[str] = Query(None, description="Comma-separated skill names"),
    education_level: Optional[str] = Query(None, description="e.g. Bachelor's, Diploma"),
    location: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    query = db.query(YouthProfile)

    if location:
        query = query.filter(YouthProfile.location.ilike(f"%{location}%"))

    if skills:
        skill_list = [s.strip() for s in skills.split(",")]
        query = query.join(YouthSkill).join(Skill).filter(Skill.name.in_(skill_list))

    if education_level:
        query = query.join(YouthEducation).filter(
            YouthEducation.degree.ilike(f"%{education_level}%")
        )

    return query.distinct().all()
