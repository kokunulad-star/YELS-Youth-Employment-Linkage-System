from sqlalchemy import (
    Column, Integer, String, Text, Boolean, Date,
    Enum, TIMESTAMP, ForeignKey, Numeric
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.database import Base


class OpportunityType(str, enum.Enum):
    job      = "job"
    funding  = "funding"
    training = "training"


class OpportunityStatus(str, enum.Enum):
    open   = "open"
    closed = "closed"
    draft  = "draft"


class JobType(str, enum.Enum):
    full_time  = "full_time"
    part_time  = "part_time"
    internship = "internship"
    contract   = "contract"


class FundingType(str, enum.Enum):
    grant  = "grant"
    loan   = "loan"
    equity = "equity"
    other  = "other"


class TrainingMode(str, enum.Enum):
    online    = "online"
    in_person = "in_person"
    hybrid    = "hybrid"


class Opportunity(Base):
    __tablename__ = "opportunities"

    id             = Column(Integer, primary_key=True, autoincrement=True)
    posted_by      = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title          = Column(String(255), nullable=False)
    description    = Column(Text, nullable=False)
    type           = Column(Enum(OpportunityType), nullable=False)
    industry       = Column(String(100))
    location       = Column(String(255))
    is_remote      = Column(Boolean, default=False)
    deadline       = Column(Date)
    status         = Column(Enum(OpportunityStatus), default=OpportunityStatus.open)

    # Job-specific
    salary_range   = Column(String(100))
    job_type       = Column(Enum(JobType))

    # Funding-specific
    funding_amount = Column(Numeric(15, 2))
    funding_type   = Column(Enum(FundingType))

    # Training-specific
    duration       = Column(String(100))
    mode           = Column(Enum(TrainingMode))

    created_at     = Column(TIMESTAMP, server_default=func.now())
    updated_at     = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    # Relationships
    poster             = relationship("User", back_populates="opportunities")
    opportunity_skills = relationship("OpportunitySkill", back_populates="opportunity", cascade="all, delete-orphan")
    applications       = relationship("Application", back_populates="opportunity")


class OpportunitySkill(Base):
    __tablename__ = "opportunity_skills"

    opportunity_id = Column(Integer, ForeignKey("opportunities.id", ondelete="CASCADE"), primary_key=True)
    skill_id       = Column(Integer, ForeignKey("skills.id", ondelete="CASCADE"), primary_key=True)

    # Relationships
    opportunity = relationship("Opportunity", back_populates="opportunity_skills")
    skill       = relationship("Skill", back_populates="opportunity_skills")
