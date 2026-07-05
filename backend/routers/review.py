from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from database import get_db

from models.review import ReviewDB
from models.user import UserDB
from models.product import ProductDB

from schemas.review import (
    ReviewCreate,
    ReviewUpdate,
    ReviewRead,
    ReviewUser,
    ReviewProduct,
)

router = APIRouter(
    prefix="/reviews",
    tags=["Reviews"],
)

# ==========================
# GET ALL REVIEWS
# ==========================

@router.get("", response_model=list[ReviewRead])
def get_reviews(db: Session = Depends(get_db)):
    reviews = (
        db.query(ReviewDB)
        .options(
            joinedload(ReviewDB.user),
            joinedload(ReviewDB.product),
        )
        .all()
    )

    return [
        ReviewRead(
            id=review.id,
            rating=review.rating,
            comment=review.comment,
            imageUrl=review.image_path,
            created_at=review.created_at,
            user=ReviewUser(
                id=review.user.id,
                full_name=review.user.full_name,
            ),
            product=ReviewProduct(
                id=review.product.id,
                name=review.product.name,
            ),
        )
        for review in reviews
    ]


# ==========================
# GET REVIEW BY PRODUCT
# ==========================

@router.get("/product/{product_id}", response_model=list[ReviewRead])
def get_reviews_by_product(
    product_id: int,
    db: Session = Depends(get_db),
):
    reviews = (
        db.query(ReviewDB)
        .options(
            joinedload(ReviewDB.user),
            joinedload(ReviewDB.product),
        )
        .filter(ReviewDB.product_id == product_id)
        .all()
    )

    return [
        ReviewRead(
            id=review.id,
            rating=review.rating,
            comment=review.comment,
            imageUrl=review.image_path,
            created_at=review.created_at,
            user=ReviewUser(
                id=review.user.id,
                full_name=review.user.full_name,
            ),
            product=ReviewProduct(
                id=review.product.id,
                name=review.product.name,
            ),
        )
        for review in reviews
    ]


# ==========================
# GET REVIEW BY ID
# ==========================

@router.get("/{review_id}", response_model=ReviewRead)
def get_review(
    review_id: int,
    db: Session = Depends(get_db),
):
    review = (
        db.query(ReviewDB)
        .options(
            joinedload(ReviewDB.user),
            joinedload(ReviewDB.product),
        )
        .filter(ReviewDB.id == review_id)
        .first()
    )

    if not review:
        raise HTTPException(
            status_code=404,
            detail="Review not found",
        )

    return ReviewRead(
        id=review.id,
        rating=review.rating,
        comment=review.comment,
        imageUrl=review.image_path,
        created_at=review.created_at,
        user=ReviewUser(
            id=review.user.id,
            full_name=review.user.full_name,
        ),
        product=ReviewProduct(
            id=review.product.id,
            name=review.product.name,
        ),
    )


# ==========================
# CREATE REVIEW
# ==========================

@router.post(
    "",
    response_model=ReviewRead,
    status_code=status.HTTP_201_CREATED,
)
def create_review(
    payload: ReviewCreate,
    db: Session =Depends(get_db),
):

    user = (
        db.query(UserDB)
        .filter(UserDB.id == payload.user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

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
        db.query(ReviewDB)
        .filter(
            ReviewDB.user_id == payload.user_id,
            ReviewDB.product_id == payload.product_id,
        )
        .first()
    )

    if exists:
        raise HTTPException(
            status_code=400,
            detail="You already reviewed this product.",
        )

    review = ReviewDB(
        user_id=payload.user_id,
        product_id=payload.product_id,
        rating=payload.rating,
        comment=payload.comment,
        image_path=payload.imageUrl,
    )

    db.add(review)

    db.commit()

    db.refresh(review)

    review = (
        db.query(ReviewDB)
        .options(
            joinedload(ReviewDB.user),
            joinedload(ReviewDB.product),
        )
        .filter(ReviewDB.id == review.id)
        .first()
    )

    return ReviewRead(
        id=review.id,
        rating=review.rating,
        comment=review.comment,
        imageUrl=review.image_path,
        created_at=review.created_at,
        user=ReviewUser(
            id=review.user.id,
            full_name=review.user.full_name,
        ),
        product=ReviewProduct(
            id=review.product.id,
            name=review.product.name,
        ),
    )


# ==========================
# UPDATE REVIEW
# ==========================

@router.put("/{review_id}", response_model=ReviewRead)
def update_review(
    review_id: int,
    payload: ReviewUpdate,
    db: Session = Depends(get_db),
):
    review = (
        db.query(ReviewDB)
        .options(
            joinedload(ReviewDB.user),
            joinedload(ReviewDB.product),
        )
        .filter(ReviewDB.id == review_id)
        .first()
    )

    if not review:
        raise HTTPException(
            status_code=404,
            detail="Review not found",
        )

    if payload.rating is not None:
        review.rating = payload.rating

    if payload.comment is not None:
        review.comment = payload.comment

    if payload.imageUrl is not None:
        review.image_path = payload.imageUrl

    db.commit()

    db.refresh(review)

    return ReviewRead(
        id=review.id,
        rating=review.rating,
        comment=review.comment,
        imageUrl=review.image_path,
        created_at=review.created_at,
        user=ReviewUser(
            id=review.user.id,
            full_name=review.user.full_name,
        ),
        product=ReviewProduct(
            id=review.product.id,
            name=review.product.name,
        ),
    )


# ==========================
# DELETE REVIEW
# ==========================

@router.delete(
    "/{review_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
):
    review = (
        db.query(ReviewDB)
        .filter(ReviewDB.id == review_id)
        .first()
    )

    if not review:
        raise HTTPException(
            status_code=404,
            detail="Review not found",
        )

    db.delete(review)

    db.commit()