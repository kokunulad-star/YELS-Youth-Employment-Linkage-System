from pydantic import BaseModel, field_validator, model_validator
from datetime import date
from typing import Optional, List
from decimal import Decimal
from app.models.opportunity import (
    OpportunityType, OpportunityStatus,
    JobType, FundingType, TrainingMode
)
from app.schemas.youth import SkillOut


class OpportunityIn(BaseModel):
    title: str
    description: str
    type: OpportunityType
    industry: Optional[str] = None
    location: Optional[str] = None
    is_remote: bool = False
    deadline: Optional[date] = None
    status: OpportunityStatus = OpportunityStatus.open
    # Job-specific
    salary_range: Optional[str] = None
    job_type: Optional[JobType] = None
    # Funding-specific
    funding_amount: Optional[Decimal] = None
    funding_type: Optional[FundingType] = None
    # Training-specific
    duration: Optional[str] = None
    mode: Optional[TrainingMode] = None
    # Required skill IDs
    skill_ids: List[int] = []


class OpportunityUpdate(OpportunityIn):
    title: Optional[str] = None
    description: Optional[str] = None
    type: Optional[OpportunityType] = None
    skill_ids: Optional[List[int]] = None


class OpportunityOut(BaseModel):
    id: int
    posted_by: int
    title: str
    description: str
    type: OpportunityType
    industry: Optional[str] = None
    location: Optional[str] = None
    is_remote: bool
    deadline: Optional[date] = None
    status: OpportunityStatus
    salary_range: Optional[str] = None
    job_type: Optional[JobType] = None
    funding_amount: Optional[Decimal] = None
    funding_type: Optional[FundingType] = None
    duration: Optional[str] = None
    mode: Optional[TrainingMode] = None
    required_skills: List[SkillOut] = []

    model_config = {"from_attributes": True}

    @model_validator(mode="before")
    @classmethod
    def extract_skills(cls, obj):
        """Map opportunity_skills relationship → required_skills list."""
        if hasattr(obj, "opportunity_skills"):
            obj.__dict__["required_skills"] = [
                osk.skill for osk in obj.opportunity_skills if osk.skill
            ]
        return obj
