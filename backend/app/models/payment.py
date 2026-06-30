from sqlalchemy import Column, Integer, String, Numeric, Enum, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.database import Base


class PaymentStatus(str, enum.Enum):
    pending   = "pending"
    completed = "completed"
    failed    = "failed"


class PaymentMethod(str, enum.Enum):
    mpesa  = "mpesa"
    card   = "card"
    bank   = "bank"


class Payment(Base):
    __tablename__ = "payments"

    id             = Column(Integer, primary_key=True, autoincrement=True)
    youth_id       = Column(Integer, ForeignKey("youth_profiles.id", ondelete="CASCADE"), nullable=False)
    opportunity_id = Column(Integer, ForeignKey("opportunities.id", ondelete="CASCADE"), nullable=False)
    amount         = Column(Numeric(15, 2), nullable=False)
    method         = Column(Enum(PaymentMethod), nullable=False)
    status         = Column(Enum(PaymentStatus), default=PaymentStatus.completed)
    reference      = Column(String(100))
    paid_at        = Column(TIMESTAMP, server_default=func.now())

    # Relationships
    youth       = relationship("YouthProfile")
    opportunity = relationship("Opportunity")
