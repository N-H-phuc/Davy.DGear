from pydantic import BaseModel


# ==========================
# PRODUCT INSIDE WISHLIST
# ==========================

class WishlistProduct(BaseModel):
    id: int
    name: str
    price: float
    category: str
    description: str
    imageUrl: str

    class Config:
        from_attributes = True


# ==========================
# CREATE
# ==========================

class WishlistCreate(BaseModel):
    user_id: int
    product_id: int


# ==========================
# READ
# ==========================

class WishlistRead(BaseModel):
    id: int
    user_id: int
    product: WishlistProduct

    class Config:
        from_attributes = True