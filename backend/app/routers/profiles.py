from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import os, shutil, uuid
from app.database import get_db
from app.models.user import UserRole
from app.models.organization import OrganizationProfile
from app.models.investor import InvestorProfile
from app.schemas.organization import OrgProfileIn, OrgProfileUpdate, OrgProfileOut
from app.schemas.investor import InvestorProfileIn, InvestorProfileUpdate, InvestorProfileOut
from app.core.security import require_role
from app.config import get_settings

settings = get_settings()
router = APIRouter(prefix="/api/profiles", tags=["Profiles"])


# ── Organization ─────────────────────────────────────────────────────────────

@router.post("/organization", response_model=OrgProfileOut, status_code=201)
def create_org_profile(
    payload: OrgProfileIn,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(UserRole.organization)),
):
    if db.query(OrganizationProfile).filter(OrganizationProfile.user_id == current_user.id).first():
        raise HTTPException(400, "Profile already exists")
    profile = OrganizationProfile(user_id=current_user.id, **payload.model_dump())
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


@router.get("/organization/me", response_model=OrgProfileOut)
def get_org_profile(
    db: Session = Depends(get_db),
    current_user=Depends(require_role(UserRole.organization)),
):
    profile = db.query(OrganizationProfile).filter(OrganizationProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(404, "Profile not found")
    return profile


@router.put("/organization/me", response_model=OrgProfileOut)
def update_org_profile(
    payload: OrgProfileUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(UserRole.organization)),
):
    profile = db.query(OrganizationProfile).filter(OrganizationProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(404, "Profile not found")
    for k, v in payload.model_dump(exclude_none=True).items():
        setattr(profile, k, v)
    db.commit()
    db.refresh(profile)
    return profile


@router.post("/organization/me/upload-logo")
def upload_org_logo(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(require_role(UserRole.organization)),
):
    profile = db.query(OrganizationProfile).filter(OrganizationProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(404, "Profile not found")
    ext = os.path.splitext(file.filename)[1]
    filename = f"org_logo_{current_user.id}_{uuid.uuid4().hex}{ext}"
    dest = os.path.join(settings.UPLOAD_DIR, "logos", filename)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    with open(dest, "wb") as f:
        shutil.copyfileobj(file.file, f)
    profile.logo_url = dest
    db.commit()
    return {"logo_url": dest}


# ── Investor ──────────────────────────────────────────────────────────────────

@router.post("/investor", response_model=InvestorProfileOut, status_code=201)
def create_investor_profile(
    payload: InvestorProfileIn,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(UserRole.investor)),
):
    if db.query(InvestorProfile).filter(InvestorProfile.user_id == current_user.id).first():
        raise HTTPException(400, "Profile already exists")
    profile = InvestorProfile(user_id=current_user.id, **payload.model_dump())
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


@router.get("/investor/me", response_model=InvestorProfileOut)
def get_investor_profile(
    db: Session = Depends(get_db),
    current_user=Depends(require_role(UserRole.investor)),
):
    profile = db.query(InvestorProfile).filter(InvestorProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(404, "Profile not found")
    return profile


@router.put("/investor/me", response_model=InvestorProfileOut)
def update_investor_profile(
    payload: InvestorProfileUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(UserRole.investor)),
):
    profile = db.query(InvestorProfile).filter(InvestorProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(404, "Profile not found")
    for k, v in payload.model_dump(exclude_none=True).items():
        setattr(profile, k, v)
    db.commit()
    db.refresh(profile)
    return profile
