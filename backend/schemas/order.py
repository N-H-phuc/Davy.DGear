from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# ==========================
# ORDER ITEM
# ==========================

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int


class OrderItemRead(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: float

    class Config:
        from_attributes = True


# ==========================
# CREATE ORDER
# ==========================

class OrderCreate(BaseModel):
    full_name: str
    phone: str
    address: str
    payment_method: str

    items: List[OrderItemCreate]


# ==========================
# UPDATE STATUS (SHIPPER)
# ==========================

class OrderStatusUpdate(BaseModel):
    status: str
    delivery_note: Optional[str] = None
    failure_reason: Optional[str] = None


# ==========================
# ASSIGN SHIPPER
# ==========================

class AssignShipper(BaseModel):
    shipper_id: int


# ==========================
# OTP VERIFY
# ==========================

class VerifyOTP(BaseModel):
    otp_code: str


# ==========================
# READ ORDER
# ==========================

class OrderRead(BaseModel):
    id: int
    user_id: int

    full_name: str
    phone: str
    address: str

    payment_method: str

    total_price: float

    status: str

    # ======================
    # SHIPPER
    # ======================
    shipper_id: Optional[int] = None
    shipper_name: Optional[str] = None

    accepted_at: Optional[datetime] = None
    pickup_at: Optional[datetime] = None
    shipping_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None
    failed_at: Optional[datetime] = None

    delivery_note: Optional[str] = None
    failure_reason: Optional[str] = None

    proof_image: Optional[str] = None

    otp_code: Optional[str] = None

    delivery_fee: Optional[float] = None

    created_at: datetime
    updated_at: Optional[datetime] = None

    items: List[OrderItemRead]

    class Config:
        from_attributes = True


# ==========================
# SHIPPER DASHBOARD
# ==========================

class ShipperDashboard(BaseModel):
    waiting_orders: int
    delivering_orders: int
    delivered_orders: int
    failed_orders: int
    total_income: float


# ==========================
# SHIPPER HISTORY
# ==========================

class ShipperHistory(BaseModel):
    id: int
    full_name: str
    phone: str
    address: str

    total_price: float
    delivery_fee: float

    status: str

    delivered_at: Optional[datetime]

    class Config:
        from_attributes = True