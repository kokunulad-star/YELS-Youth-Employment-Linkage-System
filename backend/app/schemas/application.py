from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from app.models.application import ApplicationStatus


class ApplicationIn(BaseModel):
    opportunity_id: int
    cover_letter: Optional[str] = None


class ApplicationStatusUpdate(BaseModel):
    status: ApplicationStatus
    note: Optional[str] = None


class StatusHistoryOut(BaseModel):
    old_status: Optional[ApplicationStatus] = None
    new_status: Optional[ApplicationStatus] = None
    note: Optional[str] = None
    changed_at: datetime
    model_config = {"from_attributes": True}


class ApplicationOut(BaseModel):
    id: int
    youth_id: int
    opportunity_id: int
    applicant_name: Optional[str] = None
    opportunity_title: Optional[str] = None
    cover_letter: Optional[str] = None
    document_url: Optional[str] = None
    status: ApplicationStatus
    applied_at: datetime
    updated_at: datetime
    history: List[StatusHistoryOut] = []
    model_config = {"from_attributes": True}
