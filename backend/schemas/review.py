from pydantic import BaseModel
from datetime import datetime


# ==========================
# USER INFO
# ==========================

class ReviewUser(BaseModel):
    id: int
    full_name: str

    class Config:
        from_attributes = True


# ==========================
# PRODUCT INFO
# ==========================

class ReviewProduct(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


# ==========================
# CREATE
# ==========================

class ReviewCreate(BaseModel):
    user_id: int
    product_id: int
    rating: int
    comment: str
    imageUrl: str = ""


# ==========================
# UPDATE
# ==========================

class ReviewUpdate(BaseModel):
    rating: int | None = None
    comment: str | None = None
    imageUrl: str | None = None


# ==========================
# READ
# ==========================

class ReviewRead(BaseModel):
    id: int

    rating: int

    comment: str

    imageUrl: str

    created_at: datetime

    user: ReviewUser

    product: ReviewProduct

    class Config:
        from_attributes = True