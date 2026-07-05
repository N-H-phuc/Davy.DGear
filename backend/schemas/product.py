from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


# ==========================
# BASE
# ==========================

class ProductBase(BaseModel):

    name: str = Field(
        ...,
        min_length=3,
        max_length=100,
    )

    price: float = Field(
        ...,
        gt=0,
    )

    category: str = Field(
        ...,
        min_length=3,
    )

    description: str = Field(
        ...,
        min_length=5,
    )

    # ==========================
    # FLASH SALE
    # ==========================

    is_flash_sale: bool = False

    flash_sale_percent: int = Field(
        default=0,
        ge=0,
        le=100,
    )

    flash_sale_start: Optional[datetime] = None

    flash_sale_end: Optional[datetime] = None

    # ==========================
    # STATISTICS
    # ==========================

    sold: int = 0

    stock: int = 0


# ==========================
# CREATE
# ==========================

class ProductCreate(ProductBase):

    imageUrl: str = ""


# ==========================
# UPDATE
# ==========================

class ProductUpdate(BaseModel):

    name: Optional[str] = None

    price: Optional[float] = None

    category: Optional[str] = None

    description: Optional[str] = None

    imageUrl: Optional[str] = None

    is_flash_sale: Optional[bool] = None

    flash_sale_percent: Optional[int] = None

    flash_sale_start: Optional[datetime] = None

    flash_sale_end: Optional[datetime] = None

    sold: Optional[int] = None

    stock: Optional[int] = None


# ==========================
# READ
# ==========================

class ProductRead(ProductBase):

    id: int

    imageUrl: str

    # Giá sau khi áp dụng Flash Sale
    flash_price: float

    class Config:
        from_attributes = True