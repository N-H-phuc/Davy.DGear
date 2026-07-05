from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# ==========================
# BASE
# ==========================

class VoucherBase(BaseModel):
    code: str
    discount: float
    quantity: int
    is_active: bool = True
    expired_at: Optional[datetime] = None


# ==========================
# CREATE
# ==========================

class VoucherCreate(VoucherBase):
    pass


# ==========================
# UPDATE
# ==========================

class VoucherUpdate(BaseModel):
    code: Optional[str] = None
    discount: Optional[float] = None
    quantity: Optional[int] = None
    is_active: Optional[bool] = None
    expired_at: Optional[datetime] = None


# ==========================
# READ
# ==========================

class VoucherRead(VoucherBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ==========================
# APPLY
# ==========================

class VoucherApply(BaseModel):
    code: str
    total_price: float


class VoucherApplyResponse(BaseModel):
    code: str
    discount_percent: float
    discount_amount: float
    final_price: float