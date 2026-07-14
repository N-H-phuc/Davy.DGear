from pydantic import BaseModel
from datetime import datetime
from typing import Optional


# ==========================
# CREATE PAYMENT
# ==========================
class PaymentCreate(BaseModel):
    order_id: int
    payment_method: str


# ==========================
# CONFIRM PAYMENT
# ==========================
class PaymentConfirm(BaseModel):
    order_id: int
    provider: str


# ==========================
# RESPONSE
# ==========================
class PaymentRead(BaseModel):
    id: int
    order_id: int
    payment_method: str
    amount: float
    currency: str
    status: str
    transaction_code: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True