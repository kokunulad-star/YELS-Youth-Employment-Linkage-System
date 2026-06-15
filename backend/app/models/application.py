from sqlalchemy import (
    Column, Integer, Text, Enum, TIMESTAMP,
    ForeignKey, UniqueConstraint
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.database import Base


class ApplicationStatus(str, enum.Enum):
    pending     = "pending"
    shortlisted = "shortlisted"
    interviewed = "interviewed"
    accepted    = "accepted"
    rejected    = "rejected"


class Application(Base):
    __tablename__ = "applications"

    id             = Column(Integer, primary_key=True, autoincrement=True)
    youth_id       = Column(Integer, ForeignKey("youth_profiles.id", ondelete="CASCADE"), nullable=False)
    opportunity_id = Column(Integer, ForeignKey("opportunities.id", ondelete="CASCADE"), nullable=False)
    cover_letter   = Column(Text)
    status         = Column(Enum(ApplicationStatus), default=ApplicationStatus.pending)
    applied_at     = Column(TIMESTAMP, server_default=func.now())
    updated_at     = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        UniqueConstraint("youth_id", "opportunity_id", name="unique_application"),
    )

    # Relationships
    youth       = relationship("YouthProfile", back_populates="applications")
    opportunity = relationship("Opportunity", back_populates="applications")
    history     = relationship("ApplicationStatusHistory", back_populates="application", cascade="all, delete-orphan")


class ApplicationStatusHistory(Base):
    __tablename__ = "application_status_history"

    id             = Column(Integer, primary_key=True, autoincrement=True)
    application_id = Column(Integer, ForeignKey("applications.id", ondelete="CASCADE"), nullable=False)
    old_status     = Column(Enum(ApplicationStatus))
    new_status     = Column(Enum(ApplicationStatus))
    changed_by     = Column(Integer, ForeignKey("users.id"), nullable=False)
    note           = Column(Text)
    changed_at     = Column(TIMESTAMP, server_default=func.now())

    # Relationships
    application = relationship("Application", back_populates="history")
