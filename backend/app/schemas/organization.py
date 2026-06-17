from pydantic import BaseModel
from typing import Optional


class OrgProfileIn(BaseModel):
    name: str
    description: Optional[str] = None
    industry: Optional[str] = None
    website_url: Optional[str] = None
    location: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None


class OrgProfileUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    industry: Optional[str] = None
    website_url: Optional[str] = None
    location: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None


class OrgProfileOut(BaseModel):
    id: int
    user_id: int
    name: str
    description: Optional[str] = None
    industry: Optional[str] = None
    website_url: Optional[str] = None
    location: Optional[str] = None
    logo_url: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    model_config = {"from_attributes": True}
