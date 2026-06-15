from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class OrganizationProfile(Base):
    __tablename__ = "organization_profiles"

    id            = Column(Integer, primary_key=True, autoincrement=True)
    user_id       = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    name          = Column(String(255), nullable=False)
    description   = Column(Text)
    industry      = Column(String(100))
    website_url   = Column(String(500))
    location      = Column(String(255))
    logo_url      = Column(String(500))
    contact_email = Column(String(255))
    contact_phone = Column(String(20))
    created_at    = Column(TIMESTAMP, server_default=func.now())
    updated_at    = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="organization_profile")
