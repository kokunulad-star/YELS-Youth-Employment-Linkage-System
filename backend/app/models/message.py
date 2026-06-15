from sqlalchemy import (
    Column, Integer, Text, Boolean, TIMESTAMP,
    ForeignKey, UniqueConstraint
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Conversation(Base):
    __tablename__ = "conversations"

    id            = Column(Integer, primary_key=True, autoincrement=True)
    participant_1 = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    participant_2 = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at    = Column(TIMESTAMP, server_default=func.now())

    __table_args__ = (
        UniqueConstraint("participant_1", "participant_2", name="unique_conversation"),
    )

    # Relationships
    user1    = relationship("User", foreign_keys=[participant_1], back_populates="conversations_as_p1")
    user2    = relationship("User", foreign_keys=[participant_2], back_populates="conversations_as_p2")
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")


class Message(Base):
    __tablename__ = "messages"

    id              = Column(Integer, primary_key=True, autoincrement=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id", ondelete="CASCADE"), nullable=False)
    sender_id       = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    body            = Column(Text, nullable=False)
    is_read         = Column(Boolean, default=False)
    sent_at         = Column(TIMESTAMP, server_default=func.now())

    # Relationships
    conversation = relationship("Conversation", back_populates="messages")
    sender       = relationship("User", back_populates="sent_messages")
