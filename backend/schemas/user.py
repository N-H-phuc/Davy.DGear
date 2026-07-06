from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field

# from pydantic import BaseModel, EmailStr
# ==========================
# CREATE
# ==========================
class UserCreate(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=3, max_length=100)
    password: str = Field(..., min_length=6)


# ==========================
# UPDATE
# ==========================
class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None
    role: Optional[str] = None


# ==========================
# READ
# ==========================
class UserRead(BaseModel):
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



# profile
class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str