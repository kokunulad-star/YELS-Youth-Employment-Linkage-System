from sqlalchemy import (
    Column, Integer, String, Text, Boolean, Date,
    Enum, TIMESTAMP, ForeignKey, UniqueConstraint
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.database import Base


class GenderEnum(str, enum.Enum):
    male   = "male"
    female = "female"
    other  = "other"


class SkillLevel(str, enum.Enum):
    beginner     = "beginner"
    intermediate = "intermediate"
    advanced     = "advanced"


class YouthProfile(Base):
    __tablename__ = "youth_profiles"

    id                = Column(Integer, primary_key=True, autoincrement=True)
    user_id           = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    first_name        = Column(String(100), nullable=False)
    last_name         = Column(String(100), nullable=False)
    date_of_birth     = Column(Date)
    gender            = Column(Enum(GenderEnum))
    phone             = Column(String(20))
    location          = Column(String(255))
    bio               = Column(Text)
    cv_url            = Column(String(500))
    linkedin_url      = Column(String(500))
    github_url        = Column(String(500))
    portfolio_url     = Column(String(500))
    profile_photo_url = Column(String(500))
    created_at        = Column(TIMESTAMP, server_default=func.now())
    updated_at        = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    # Relationships
    user         = relationship("User", back_populates="youth_profile")
    education    = relationship("YouthEducation", back_populates="youth", cascade="all, delete-orphan")
    youth_skills = relationship("YouthSkill", back_populates="youth", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="youth")


class YouthEducation(Base):
    __tablename__ = "youth_education"

    id             = Column(Integer, primary_key=True, autoincrement=True)
    youth_id       = Column(Integer, ForeignKey("youth_profiles.id", ondelete="CASCADE"), nullable=False)
    institution    = Column(String(255), nullable=False)
    degree         = Column(String(100))
    field_of_study = Column(String(255))
    start_year     = Column(Integer)
    end_year       = Column(Integer)
    is_current     = Column(Boolean, default=False)

    # Relationships
    youth = relationship("YouthProfile", back_populates="education")


class Skill(Base):
    __tablename__ = "skills"

    id   = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), unique=True, nullable=False)

    # Relationships
    youth_skills        = relationship("YouthSkill", back_populates="skill")
    opportunity_skills  = relationship("OpportunitySkill", back_populates="skill")


class YouthSkill(Base):
    __tablename__ = "youth_skills"

    youth_id = Column(Integer, ForeignKey("youth_profiles.id", ondelete="CASCADE"), primary_key=True)
    skill_id = Column(Integer, ForeignKey("skills.id", ondelete="CASCADE"), primary_key=True)
    level    = Column(Enum(SkillLevel))

    # Relationships
    youth = relationship("YouthProfile", back_populates="youth_skills")
    skill = relationship("Skill", back_populates="youth_skills")
