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
    old_status: Optional[ApplicationStatus]
    new_status: Optional[ApplicationStatus]
    note: Optional[str]
    changed_at: datetime

    class Config:
        from_attributes = True


class ApplicationOut(BaseModel):
    id: int
    youth_id: int
    opportunity_id: int
    cover_letter: Optional[str]
    status: ApplicationStatus
    applied_at: datetime
    updated_at: datetime
    history: List[StatusHistoryOut] = []

    class Config:
        from_attributes = True
