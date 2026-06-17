from pydantic import BaseModel
from typing import Optional


class InvestorProfileIn(BaseModel):
    name: str
    description: Optional[str] = None
    focus_area: Optional[str] = None
    website_url: Optional[str] = None
    location: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None


class InvestorProfileUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    focus_area: Optional[str] = None
    website_url: Optional[str] = None
    location: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None


class InvestorProfileOut(BaseModel):
    id: int
    user_id: int
    name: str
    description: Optional[str] = None
    focus_area: Optional[str] = None
    website_url: Optional[str] = None
    location: Optional[str] = None
    logo_url: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    model_config = {"from_attributes": True}
