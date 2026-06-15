from pydantic import BaseModel
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
    # Job
    salary_range: Optional[str] = None
    job_type: Optional[JobType] = None
    # Funding
    funding_amount: Optional[Decimal] = None
    funding_type: Optional[FundingType] = None
    # Training
    duration: Optional[str] = None
    mode: Optional[TrainingMode] = None
    # Required skills (list of skill IDs)
    skill_ids: List[int] = []


class OpportunityUpdate(OpportunityIn):
    title: Optional[str] = None
    description: Optional[str] = None
    type: Optional[OpportunityType] = None


class OpportunityOut(BaseModel):
    id: int
    posted_by: int
    title: str
    description: str
    type: OpportunityType
    industry: Optional[str]
    location: Optional[str]
    is_remote: bool
    deadline: Optional[date]
    status: OpportunityStatus
    salary_range: Optional[str]
    job_type: Optional[JobType]
    funding_amount: Optional[Decimal]
    funding_type: Optional[FundingType]
    duration: Optional[str]
    mode: Optional[TrainingMode]
    required_skills: List[SkillOut] = []

    class Config:
        from_attributes = True
