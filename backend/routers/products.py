from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models.product import ProductDB
from schemas.product import (
    ProductCreate,
    ProductUpdate,
    ProductRead,
)

router = APIRouter(
    prefix="/products",
    tags=["Products"],
)


# ==========================
# CALCULATE FLASH PRICE
# ==========================
from datetime import datetime, timezone

def calculate_flash_price(product: ProductDB):
    now = datetime.now(timezone.utc)

    if (
        product.is_flash_sale
        and product.flash_sale_percent > 0
        and product.flash_sale_start
        and product.flash_sale_end
        and product.flash_sale_start <= now <= product.flash_sale_end
    ):
        return (
            True,
            round(
                product.price
                - (
                    product.price
                    * product.flash_sale_percent
                    / 100
                ),
                2,
            ),
        )

    # Flash sale đã hết
    return (
        False,
        product.price,
    )


# ==========================
# GET ALL PRODUCTS
# ==========================
from typing import Optional
from fastapi import Query

@router.get("")
def get_products(
    page: int = Query(1, ge=1),
    limit: int = Query(8, ge=1),

    search: Optional[str] = None,
    category: Optional[str] = None,
    sort: Optional[str] = None,

    db: Session = Depends(get_db),
):
    query = db.query(ProductDB)

# ======================
# Search
# ======================

    if search:
        query = query.filter(
            ProductDB.name.ilike(f"%{search}%")
    )

# ======================
# Category
# ======================

    if category and category != "All":
        query = query.filter(
            ProductDB.category == category
    )

# ======================
# Sort
# ======================

    if sort == "price-asc":
        query = query.order_by(ProductDB.price.asc())

    elif sort == "price-desc":
        query = query.order_by(ProductDB.price.desc())

    else:
        query = query.order_by(ProductDB.id.desc())

# ======================
# Pagination
# ======================

    total = query.count()

    products = (
        query
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
)

    result = []

    for p in products:

        active, flash_price = calculate_flash_price(p)

        result.append(
        ProductRead(
            id=p.id,
            name=p.name,
            price=p.price,
            flash_price=flash_price,
            category=p.category,
            description=p.description,
            imageUrl=p.image_path,
            is_flash_sale=active,
            flash_sale_percent=p.flash_sale_percent,
            flash_sale_start=p.flash_sale_start,
            flash_sale_end=p.flash_sale_end,
            sold=p.sold,
            stock=p.stock,
        )
    )

    return {
    "items": result,
    "page": page,
    "limit": limit,
    "total": total,
    "total_pages": (total + limit - 1) // limit,
}


# ==========================
# GET FLASH SALE PRODUCTS
# ==========================

@router.get("/flash-sale", response_model=list[ProductRead])
def get_flash_sale_products(
    db: Session = Depends(get_db),
):
    now = datetime.now(timezone.utc)

    products = (
        db.query(ProductDB)
        .filter(
            ProductDB.is_flash_sale == True,
            ProductDB.flash_sale_start <= now,
            ProductDB.flash_sale_end >= now,
        )
        .all()
    )

    result = []

    for p in products:
        active, flash_price = calculate_flash_price(p)
        result.append(
            ProductRead(
                id=p.id,
                name=p.name,
                price=p.price,
                flash_price=flash_price,
                category=p.category,
                description=p.description,
                imageUrl=p.image_path,
                is_flash_sale=active,
                flash_sale_percent=p.flash_sale_percent,
                flash_sale_start=p.flash_sale_start,
                flash_sale_end=p.flash_sale_end,
                sold=p.sold,
                stock=p.stock,
            )
        )

    return result

# ==========================
# GET PRODUCT BY ID
# ==========================

@router.get("/{product_id}", response_model=ProductRead)
def get_product(
    product_id: int,
    db: Session = Depends(get_db),
):
    product = (
        db.query(ProductDB)
        .filter(ProductDB.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )
    active, flash_price = calculate_flash_price(product)
    return ProductRead(
        id=product.id,
        name=product.name,
        price=product.price,
        flash_price=flash_price,
        category=product.category,
        description=product.description,
        imageUrl=product.image_path,
        is_flash_sale=active,
        flash_sale_percent=product.flash_sale_percent,
        flash_sale_start=product.flash_sale_start,
        flash_sale_end=product.flash_sale_end,
        sold=product.sold,
        stock=product.stock,
    )


# ==========================
# CREATE PRODUCT
# ==========================

@router.post(
    "",
    response_model=ProductRead,
    status_code=status.HTTP_201_CREATED,
)
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
):
    product = ProductDB(
        name=payload.name,
        price=payload.price,
        category=payload.category,
        description=payload.description,
        image_path=payload.imageUrl,

        is_flash_sale=payload.is_flash_sale,
        flash_sale_percent=payload.flash_sale_percent,
        flash_sale_start=payload.flash_sale_start,
        flash_sale_end=payload.flash_sale_end,

        sold=payload.sold,
        stock=payload.stock,
    )

    db.add(product)
    db.commit()
    db.refresh(product)
    active, flash_price = calculate_flash_price(product)
    return ProductRead(
        id=product.id,
        name=product.name,
        price=product.price,
        flash_price=flash_price,
        category=product.category,
        description=product.description,
        imageUrl=product.image_path,
        is_flash_sale=active,
        flash_sale_percent=product.flash_sale_percent,
        flash_sale_start=product.flash_sale_start,
        flash_sale_end=product.flash_sale_end,
        sold=product.sold,
        stock=product.stock,
    )

# ==========================
# UPDATE PRODUCT
# ==========================

@router.put("/{product_id}", response_model=ProductRead)
def update_product(
    product_id: int,
    payload: ProductUpdate,
    db: Session = Depends(get_db),
):
    product = (
        db.query(ProductDB)
        .filter(ProductDB.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    if payload.name is not None:
        product.name = payload.name

    if payload.price is not None:
        product.price = payload.price

    if payload.category is not None:
        product.category = payload.category

    if payload.description is not None:
        product.description = payload.description

    if payload.imageUrl is not None:
        product.image_path = payload.imageUrl

    if payload.is_flash_sale is not None:
        product.is_flash_sale = payload.is_flash_sale

    if payload.flash_sale_percent is not None:
        product.flash_sale_percent = payload.flash_sale_percent

    if payload.flash_sale_start is not None:
        product.flash_sale_start = payload.flash_sale_start

    if payload.flash_sale_end is not None:
        product.flash_sale_end = payload.flash_sale_end

    if payload.sold is not None:
        product.sold = payload.sold

    if payload.stock is not None:
        product.stock = payload.stock

    # Nếu tắt Flash Sale thì reset dữ liệu
    if payload.is_flash_sale is False:
        product.flash_sale_percent = 0
        product.flash_sale_start = None
        product.flash_sale_end = None

    db.commit()
    db.refresh(product)
    active, flash_price = calculate_flash_price(product)
    return ProductRead(
        id=product.id,
        name=product.name,
        price=product.price,
        flash_price=flash_price,
        category=product.category,
        description=product.description,
        imageUrl=product.image_path,
        is_flash_sale=active,
        flash_sale_percent=product.flash_sale_percent,
        flash_sale_start=product.flash_sale_start,
        flash_sale_end=product.flash_sale_end,
        sold=product.sold,
        stock=product.stock,
    )


# ==========================
# DELETE PRODUCT
# ==========================

@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
):
    product = (
        db.query(ProductDB)
        .filter(ProductDB.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    if len(product.order_items) > 0:
        raise HTTPException(
            status_code=400,
            detail="This product already exists in orders and cannot be deleted.",
        )

    db.delete(product)
    db.commit()

    return {
        "message": "Product deleted successfully"
    }