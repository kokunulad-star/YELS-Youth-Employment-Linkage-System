from sqlalchemy import Column, Integer, String, Text, Boolean, Enum, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.database import Base


class NotificationType(str, enum.Enum):
    application_update = "application_update"
    new_opportunity    = "new_opportunity"
    message            = "message"
    system             = "system"


class Notification(Base):
    __tablename__ = "notifications"

    id         = Column(Integer, primary_key=True, autoincrement=True)
    user_id    = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title      = Column(String(255), nullable=False)
    message    = Column(Text, nullable=False)
    type       = Column(Enum(NotificationType), nullable=False)
    is_read    = Column(Boolean, default=False)
    related_id = Column(Integer)             # optional: application_id or opportunity_id
    created_at = Column(TIMESTAMP, server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="notifications")
