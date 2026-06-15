from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.models.notification import NotificationType


class NotificationOut(BaseModel):
    id: int
    title: str
    message: str
    type: NotificationType
    is_read: bool
    related_id: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True
