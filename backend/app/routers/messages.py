from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.message import Conversation, Message
from app.models.notification import NotificationType
from app.schemas.message import MessageIn, MessageOut, ConversationOut
from app.core.security import get_current_user
from app.core.notifications import create_notification

router = APIRouter(prefix="/api/messages", tags=["Messages"])


def _get_or_create_conversation(db: Session, user1_id: int, user2_id: int) -> Conversation:
    """Get existing conversation or create a new one. Always store lower id as participant_1."""
    p1, p2 = (user1_id, user2_id) if user1_id < user2_id else (user2_id, user1_id)
    conv = db.query(Conversation).filter(
        Conversation.participant_1 == p1,
        Conversation.participant_2 == p2
    ).first()
    if not conv:
        conv = Conversation(participant_1=p1, participant_2=p2)
        db.add(conv)
        db.commit()
        db.refresh(conv)
    return conv


@router.post("/", response_model=MessageOut, status_code=201)
def send_message(
    payload: MessageIn,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if payload.recipient_id == current_user.id:
        raise HTTPException(400, "Cannot message yourself")

    conv = _get_or_create_conversation(db, current_user.id, payload.recipient_id)
    msg = Message(conversation_id=conv.id, sender_id=current_user.id, body=payload.body)
    db.add(msg)
    db.commit()
    db.refresh(msg)

    # Notify recipient
    create_notification(
        db,
        user_id=payload.recipient_id,
        title="New Message",
        message=f"You have a new message.",
        ntype=NotificationType.message,
        related_id=conv.id,
    )
    return msg


@router.get("/conversations", response_model=List[ConversationOut])
def list_conversations(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return db.query(Conversation).filter(
        (Conversation.participant_1 == current_user.id) |
        (Conversation.participant_2 == current_user.id)
    ).all()


@router.get("/conversations/{conv_id}", response_model=ConversationOut)
def get_conversation(
    conv_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    conv = db.query(Conversation).filter(Conversation.id == conv_id).first()
    if not conv:
        raise HTTPException(404, "Conversation not found")
    if current_user.id not in (conv.participant_1, conv.participant_2):
        raise HTTPException(403, "Not authorized")

    # Mark all incoming messages as read
    db.query(Message).filter(
        Message.conversation_id == conv_id,
        Message.sender_id != current_user.id,
        Message.is_read == False
    ).update({"is_read": True})
    db.commit()
    db.refresh(conv)
    return conv
