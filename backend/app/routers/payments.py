from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
import uuid

from app.database import get_db
from app.models.user import UserRole
from app.models.payment import Payment, PaymentStatus
from app.models.opportunity import Opportunity
from app.models.youth import YouthProfile
from app.schemas.payment import PaymentIn, PaymentOut
from app.core.security import require_role

router = APIRouter(prefix="/api/payments", tags=["Payments"])


def _enrich(payment: Payment) -> PaymentOut:
    out = PaymentOut.model_validate(payment)
    if payment.opportunity:
        out.opportunity_title = payment.opportunity.title
    return out


@router.post("/", response_model=PaymentOut, status_code=201)
def make_payment(
    payload: PaymentIn,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(UserRole.youth)),
):
    # Get youth profile
    youth = db.query(YouthProfile).filter(YouthProfile.user_id == current_user.id).first()
    if not youth:
        raise HTTPException(400, "Complete your profile before making a payment")

    # Get opportunity and validate it requires payment
    opp = db.query(Opportunity).filter(Opportunity.id == payload.opportunity_id).first()
    if not opp:
        raise HTTPException(404, "Opportunity not found")
    if opp.status != "open":
        raise HTTPException(400, "This opportunity is no longer open")
    if not opp.funding_amount or opp.funding_amount <= 0:
        raise HTTPException(400, "This opportunity does not require payment")

    # Check for duplicate payment
    existing = db.query(Payment).filter(
        Payment.youth_id == youth.id,
        Payment.opportunity_id == opp.id,
        Payment.status == PaymentStatus.completed,
    ).first()
    if existing:
        raise HTTPException(400, "You have already paid for this program")

    # Record the payment (simulated — always succeeds)
    payment = Payment(
        youth_id=youth.id,
        opportunity_id=opp.id,
        amount=opp.funding_amount,
        method=payload.method,
        status=PaymentStatus.completed,
        reference=payload.reference or f"REF-{uuid.uuid4().hex[:10].upper()}",
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)

    # Reload with relationship
    db.refresh(payment)
    payment = db.query(Payment).options(
        joinedload(Payment.opportunity)
    ).filter(Payment.id == payment.id).first()

    return _enrich(payment)


@router.get("/my", response_model=List[PaymentOut])
def my_payments(
    db: Session = Depends(get_db),
    current_user=Depends(require_role(UserRole.youth)),
):
    youth = db.query(YouthProfile).filter(YouthProfile.user_id == current_user.id).first()
    if not youth:
        return []
    payments = (
        db.query(Payment)
        .options(joinedload(Payment.opportunity))
        .filter(Payment.youth_id == youth.id)
        .order_by(Payment.paid_at.desc())
        .all()
    )
    return [_enrich(p) for p in payments]


@router.get("/check/{opportunity_id}", response_model=bool)
def check_payment(
    opportunity_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(UserRole.youth)),
):
    """Returns true if the current youth has a completed payment for this opportunity."""
    youth = db.query(YouthProfile).filter(YouthProfile.user_id == current_user.id).first()
    if not youth:
        return False
    exists = db.query(Payment).filter(
        Payment.youth_id == youth.id,
        Payment.opportunity_id == opportunity_id,
        Payment.status == PaymentStatus.completed,
    ).first()
    return exists is not None


@router.get("/admin", response_model=List[PaymentOut])
def all_payments(
    db: Session = Depends(get_db),
    _=Depends(require_role(UserRole.admin)),
):
    payments = (
        db.query(Payment)
        .options(joinedload(Payment.opportunity), joinedload(Payment.youth))
        .order_by(Payment.paid_at.desc())
        .all()
    )
    return [_enrich(p) for p in payments]
