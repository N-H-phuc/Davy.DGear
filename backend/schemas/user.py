from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field

# ==========================
# CREATE USER
# ==========================
class UserCreate(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=3, max_length=100)
    password: str = Field(..., min_length=6)


# ==========================
# CREATE SHIPPER
# ==========================
class ShipperCreate(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=3, max_length=100)
    password: str = Field(..., min_length=6)


# ==========================
# UPDATE USER
# ==========================
class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None
    role: Optional[str] = None


# ==========================
# UPDATE SHIPPER
# ==========================
class ShipperUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None


# ==========================
# READ USER
# ==========================
class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    full_name: str
    role: str


# ==========================
# READ SHIPPER
# ==========================
class ShipperRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    full_name: str
    role: str


# =====================
# LOGIN
# =====================

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# =====================
# CHANGE PASSWORD
# =====================

class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str