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
    related_id: Optional[int] = None
    created_at: datetime
    model_config = {"from_attributes": True}
