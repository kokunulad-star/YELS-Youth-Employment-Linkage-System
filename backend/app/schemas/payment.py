from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from decimal import Decimal
from app.models.payment import PaymentStatus, PaymentMethod


class PaymentIn(BaseModel):
    opportunity_id: int
    method: PaymentMethod
    reference: Optional[str] = None  # e.g. M-Pesa transaction code


class PaymentOut(BaseModel):
    id: int
    opportunity_id: int
    opportunity_title: Optional[str] = None
    amount: Decimal
    method: PaymentMethod
    status: PaymentStatus
    reference: Optional[str] = None
    paid_at: datetime
    model_config = {"from_attributes": True}
