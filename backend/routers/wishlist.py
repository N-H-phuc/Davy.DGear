from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from database import get_db

from models.wishlist import WishlistDB
from models.product import ProductDB

from schemas.wishlist import (
    WishlistCreate,
    WishlistRead,
    WishlistProduct,
)

router = APIRouter(
    prefix="/wishlist",
    tags=["Wishlist"],
)

# ==========================
# GET ALL
# ==========================

@router.get(
    "",
    response_model=list[WishlistRead],
)
def get_wishlist(
    db: Session = Depends(get_db),
):

    wishlist = (
        db.query(WishlistDB)
        .options(joinedload(WishlistDB.product))
        .all()
    )

    result = []

    for item in wishlist:

        result.append(
            WishlistRead(
                id=item.id,
                user_id=item.user_id,
                product=WishlistProduct(
                    id=item.product.id,
                    name=item.product.name,
                    price=item.product.price,
                    category=item.product.category,
                    description=item.product.description,
                    imageUrl=item.product.image_path,
                ),
            )
        )

    return result


# ==========================
# GET ONE
# ==========================

@router.get(
    "/{wishlist_id}",
    response_model=WishlistRead,
)
def get_wishlist_item(
    wishlist_id: int,
    db: Session = Depends(get_db),
):

    item = (
        db.query(WishlistDB)
        .options(joinedload(WishlistDB.product))
        .filter(WishlistDB.id == wishlist_id)
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Wishlist item not found",
        )

    return WishlistRead(
        id=item.id,
        user_id=item.user_id,
        product=WishlistProduct(
            id=item.product.id,
            name=item.product.name,
            price=item.product.price,
            category=item.product.category,
            description=item.product.description,
            imageUrl=item.product.image_path,
        ),
    )


# ==========================
# CREATE
# ==========================

@router.post(
    "",
    response_model=WishlistRead,
    status_code=status.HTTP_201_CREATED,
)
def create_wishlist(
    payload: WishlistCreate,
    db: Session = Depends(get_db),
):

    product = (
        db.query(ProductDB)
        .filter(ProductDB.id == payload.product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    exists = (
        db.query(WishlistDB)
        .filter(
            WishlistDB.user_id == payload.user_id,
            WishlistDB.product_id == payload.product_id,
        )
        .first()
    )

    if exists:
        raise HTTPException(
            status_code=400,
            detail="Already in wishlist",
        )

    wishlist = WishlistDB(
        user_id=payload.user_id,
        product_id=payload.product_id,
    )

    db.add(wishlist)

    db.commit()

    db.refresh(wishlist)

    return WishlistRead(
        id=wishlist.id,
        user_id=wishlist.user_id,
        product=WishlistProduct(
            id=product.id,
            name=product.name,
            price=product.price,
            category=product.category,
            description=product.description,
            imageUrl=product.image_path,
        ),
    )


# ==========================
# DELETE
# ==========================

@router.delete(
    "/{wishlist_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_wishlist(
    wishlist_id: int,
    db: Session = Depends(get_db),
):

    wishlist = (
        db.query(WishlistDB)
        .filter(WishlistDB.id == wishlist_id)
        .first()
    )

    if not wishlist:
        raise HTTPException(
            status_code=404,
            detail="Wishlist item not found",
        )

    db.delete(wishlist)

    db.commit()