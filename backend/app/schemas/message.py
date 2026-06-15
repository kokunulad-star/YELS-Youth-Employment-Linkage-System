from pydantic import BaseModel
from datetime import datetime
from typing import List


class MessageIn(BaseModel):
    recipient_id: int
    body: str


class MessageOut(BaseModel):
    id: int
    conversation_id: int
    sender_id: int
    body: str
    is_read: bool
    sent_at: datetime

    class Config:
        from_attributes = True


class ConversationOut(BaseModel):
    id: int
    participant_1: int
    participant_2: int
    messages: List[MessageOut] = []

    class Config:
        from_attributes = True
