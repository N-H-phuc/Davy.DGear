from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db

from models.category import CategoryDB

from schemas.category import (
    CategoryCreate,
    CategoryUpdate,
    CategoryRead,
)

router = APIRouter(
    prefix="/categories",
    tags=["Categories"],
)


# ==========================
# GET ALL
# ==========================

@router.get("", response_model=list[CategoryRead])
def get_categories(db: Session = Depends(get_db)):
    return db.query(CategoryDB).all()


# ==========================
# GET BY ID
# ==========================

@router.get("/{category_id}", response_model=CategoryRead)
def get_category(category_id: int, db: Session = Depends(get_db)):
    category = (
        db.query(CategoryDB)
        .filter(CategoryDB.id == category_id)
        .first()
    )

    if not category:
        raise HTTPException(
            status_code=404,
            detail="Category not found",
        )

    return category


# ==========================
# CREATE
# ==========================

@router.post(
    "",
    response_model=CategoryRead,
    status_code=status.HTTP_201_CREATED,
)
def create_category(
    payload: CategoryCreate,
    db: Session = Depends(get_db),
):
    category = CategoryDB(
        name=payload.name,
        description=payload.description,
    )

    db.add(category)

    db.commit()

    db.refresh(category)

    return category


# ==========================
# UPDATE
# ==========================

@router.put("/{category_id}", response_model=CategoryRead)
def update_category(
    category_id: int,
    payload: CategoryUpdate,
    db: Session = Depends(get_db),
):
    category = (
        db.query(CategoryDB)
        .filter(CategoryDB.id == category_id)
        .first()
    )

    if not category:
        raise HTTPException(
            status_code=404,
            detail="Category not found",
        )

    if payload.name is not None:
        category.name = payload.name

    if payload.description is not None:
        category.description = payload.description

    db.commit()

    db.refresh(category)

    return category


# ==========================
# DELETE
# ==========================

@router.delete(
    "/{category_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
):
    category = (
        db.query(CategoryDB)
        .filter(CategoryDB.id == category_id)
        .first()
    )

    if not category:
        raise HTTPException(
            status_code=404,
            detail="Category not found",
        )

    db.delete(category)

    db.commit()