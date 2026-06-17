from pydantic import BaseModel
from datetime import date
from typing import Optional, List
from app.models.youth import GenderEnum, SkillLevel


# ---------- Skill ----------
class SkillBase(BaseModel):
    name: str

class SkillOut(BaseModel):
    id: int
    name: str
    model_config = {"from_attributes": True}


# ---------- Youth Skill ----------
class YouthSkillIn(BaseModel):
    skill_id: int
    level: Optional[SkillLevel] = None

class YouthSkillOut(BaseModel):
    skill: SkillOut
    level: Optional[SkillLevel] = None
    model_config = {"from_attributes": True}


# ---------- Education ----------
class EducationIn(BaseModel):
    institution: str
    degree: Optional[str] = None
    field_of_study: Optional[str] = None
    start_year: Optional[int] = None
    end_year: Optional[int] = None
    is_current: bool = False

class EducationOut(EducationIn):
    id: int
    model_config = {"from_attributes": True}


# ---------- Youth Profile ----------
class YouthProfileIn(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: Optional[date] = None
    gender: Optional[GenderEnum] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None

class YouthProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[GenderEnum] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None

class YouthProfileOut(BaseModel):
    id: int
    user_id: int
    first_name: str
    last_name: str
    date_of_birth: Optional[date] = None
    gender: Optional[GenderEnum] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    cv_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    profile_photo_url: Optional[str] = None
    education: List[EducationOut] = []
    youth_skills: List[YouthSkillOut] = []

    model_config = {"from_attributes": True}
