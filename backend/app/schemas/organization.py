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


class OrgProfileUpdate(OrgProfileIn):
    name: Optional[str] = None


class OrgProfileOut(BaseModel):
    id: int
    user_id: int
    name: str
    description: Optional[str]
    industry: Optional[str]
    website_url: Optional[str]
    location: Optional[str]
    logo_url: Optional[str]
    contact_email: Optional[str]
    contact_phone: Optional[str]

    class Config:
        from_attributes = True
