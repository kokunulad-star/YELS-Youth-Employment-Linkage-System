from sqlalchemy import Column, Integer, String, Boolean, Enum, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.database import Base


class UserRole(str, enum.Enum):
    youth = "youth"
    investor = "investor"
    organization = "organization"
    admin = "admin"


class User(Base):
    __tablename__ = "users"

    id            = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email         = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role          = Column(Enum(UserRole), nullable=False)
    is_active     = Column(Boolean, default=True)
    created_at    = Column(TIMESTAMP, server_default=func.now())
    updated_at    = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    # Relationships
    youth_profile        = relationship("YouthProfile", back_populates="user", uselist=False)
    investor_profile     = relationship("InvestorProfile", back_populates="user", uselist=False)
    organization_profile = relationship("OrganizationProfile", back_populates="user", uselist=False)
    opportunities        = relationship("Opportunity", back_populates="poster")
    notifications        = relationship("Notification", back_populates="user")
    sent_messages        = relationship("Message", back_populates="sender")
    conversations_as_p1  = relationship(
        "Conversation", foreign_keys="Conversation.participant_1", back_populates="user1"
    )
    conversations_as_p2  = relationship(
        "Conversation", foreign_keys="Conversation.participant_2", back_populates="user2"
    )
