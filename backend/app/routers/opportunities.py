from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.user import UserRole
from app.models.opportunity import Opportunity, OpportunitySkill, OpportunityType
from app.models.youth import Skill
from app.schemas.opportunity import OpportunityIn, OpportunityUpdate, OpportunityOut
from app.core.security import get_current_user, require_role

router = APIRouter(prefix="/api/opportunities", tags=["Opportunities"])


def _build_out(opp: Opportunity) -> dict:
    """Attach required_skills list to the opportunity response."""
    data = OpportunityOut.model_validate(opp).model_dump()
    data["required_skills"] = [
        {"id": os.skill.id, "name": os.skill.name}
        for os in opp.opportunity_skills
    ]
    return data


@router.post("/", response_model=OpportunityOut, status_code=201)
def create_opportunity(
    payload: OpportunityIn,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(UserRole.investor, UserRole.organization)),
):
    skill_ids = payload.skill_ids
    opp_data = payload.model_dump(exclude={"skill_ids"})
    opp = Opportunity(posted_by=current_user.id, **opp_data)
    db.add(opp)
    db.flush()

    for sid in skill_ids:
        skill = db.query(Skill).filter(Skill.id == sid).first()
        if not skill:
            raise HTTPException(404, f"Skill id {sid} not found")
        db.add(OpportunitySkill(opportunity_id=opp.id, skill_id=sid))

    db.commit()
    db.refresh(opp)
    return opp


@router.get("/", response_model=List[OpportunityOut])
def list_opportunities(
    type: Optional[OpportunityType] = Query(None),
    location: Optional[str] = Query(None),
    industry: Optional[str] = Query(None),
    is_remote: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    query = db.query(Opportunity).filter(Opportunity.status == "open")
    if type:
        query = query.filter(Opportunity.type == type)
    if location:
        query = query.filter(Opportunity.location.ilike(f"%{location}%"))
    if industry:
        query = query.filter(Opportunity.industry.ilike(f"%{industry}%"))
    if is_remote is not None:
        query = query.filter(Opportunity.is_remote == is_remote)
    return query.all()


@router.get("/{opp_id}", response_model=OpportunityOut)
def get_opportunity(opp_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    opp = db.query(Opportunity).filter(Opportunity.id == opp_id).first()
    if not opp:
        raise HTTPException(404, "Opportunity not found")
    return opp


@router.put("/{opp_id}", response_model=OpportunityOut)
def update_opportunity(
    opp_id: int,
    payload: OpportunityUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(UserRole.investor, UserRole.organization)),
):
    opp = db.query(Opportunity).filter(
        Opportunity.id == opp_id, Opportunity.posted_by == current_user.id
    ).first()
    if not opp:
        raise HTTPException(404, "Opportunity not found or unauthorized")

    update_data = payload.model_dump(exclude_none=True, exclude={"skill_ids"})
    for k, v in update_data.items():
        setattr(opp, k, v)

    if payload.skill_ids is not None:
        db.query(OpportunitySkill).filter(OpportunitySkill.opportunity_id == opp_id).delete()
        for sid in payload.skill_ids:
            db.add(OpportunitySkill(opportunity_id=opp_id, skill_id=sid))

    db.commit()
    db.refresh(opp)
    return opp


@router.delete("/{opp_id}", status_code=204)
def delete_opportunity(
    opp_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role(UserRole.investor, UserRole.organization, UserRole.admin)),
):
    opp = db.query(Opportunity).filter(Opportunity.id == opp_id).first()
    if not opp:
        raise HTTPException(404, "Opportunity not found")
    if current_user.role != UserRole.admin and opp.posted_by != current_user.id:
        raise HTTPException(403, "Not authorized")
    db.delete(opp)
    db.commit()
