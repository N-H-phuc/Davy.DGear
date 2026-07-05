from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

import os
import shutil

from database import engine

# Models
from models.product import Base as ProductBase
from models.user import Base as UserBase
from models.category import Base as CategoryBase
from models.wishlist import Base as WishlistBase
from models.review import Base as ReviewBase
from models.order import Base as OrderBase
from models.order_item import Base as OrderItemBase
from models.voucher import VoucherDB

# Routers
from routers.products import router as product_router
from routers.users import router as user_router
from routers.auth import router as auth_router
from routers.category import router as category_router
from routers.wishlist import router as wishlist_router
from routers.review import router as review_router
from routers.orders import router as order_router
from routers.voucher import router as voucher_router
from routers.dashboard import router as dashboard_router

# ==========================
# CREATE APP
# ==========================

app = FastAPI(
    title="ShopHub API",
    version="2.0.0",
)

# ==========================
# STATIC IMAGE FOLDER
# ==========================

os.makedirs("uploads", exist_ok=True)

app.mount(
    "/images",
    StaticFiles(directory="images"),
    name="images",
)

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads",
)

# ==========================
# CREATE DATABASE TABLES
# ==========================

ProductBase.metadata.create_all(bind=engine)
UserBase.metadata.create_all(bind=engine)
CategoryBase.metadata.create_all(bind=engine)
WishlistBase.metadata.create_all(bind=engine)
ReviewBase.metadata.create_all(bind=engine)
OrderBase.metadata.create_all(bind=engine)
OrderItemBase.metadata.create_all(bind=engine)
VoucherDB.metadata.create_all(bind=engine)

# ==========================
# CORS
# ==========================

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================
# ROUTERS
# ==========================

app.include_router(product_router)
app.include_router(user_router)
app.include_router(auth_router)
app.include_router(category_router)
app.include_router(wishlist_router)
app.include_router(review_router)
app.include_router(order_router)
app.include_router(voucher_router)
app.include_router(dashboard_router)
# ==========================
# UPLOAD IMAGE
# ==========================

@app.post("/upload")
async def upload_image(image: UploadFile = File(...)):
    file_path = f"uploads/{image.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    return {
        "imageUrl": f"/uploads/{image.filename}"
    }

# ==========================
# ROOT
# ==========================

@app.get("/")
def root():
    return {
        "message": "Welcome to ShopHub PostgreSQL API"
    }

# ==========================
# ABOUT
# ==========================

@app.get("/about")
def about():
    return {
        "project": "ShopHub",
        "database": "PostgreSQL",
        "version": "2.0.0",
    }