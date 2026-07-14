from pydantic import BaseModel
from typing import List
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
    created_at: datetime

    items: List[OrderItemRead]

    class Config:
        from_attributes = True