from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from schemas.user import UserUpdate
from database import get_db

from models.user import UserDB

from schemas.user import (
    UserCreate,
    UserUpdate,
    UserRead,
)

from utils.security import hash_password


router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


# ==========================
# GET ALL USERS
# ==========================
@router.get("", response_model=list[UserRead])
def get_users(
    db: Session = Depends(get_db)
):

    users = db.query(UserDB).all()

    return [
        UserRead(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            role=user.role,
        )
        for user in users
    ]


# ==========================
# GET USER BY ID
# ==========================
@router.get("/{user_id}", response_model=UserRead)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
):

    user = (
        db.query(UserDB)
        .filter(UserDB.id == user_id)
        .first()
    )


    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    return UserRead(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
    )



# ==========================
# CREATE USER
# ==========================
@router.post(
    "",
    response_model=UserRead,
    status_code=status.HTTP_201_CREATED
)
def create_user(
    payload: UserCreate,
    db: Session = Depends(get_db),
):

    exists = (
        db.query(UserDB)
        .filter(
            UserDB.email == payload.email
        )
        .first()
    )


    if exists:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )


    user = UserDB(

        email=payload.email,

        full_name=payload.full_name,


        # 🔥 hash password ở đây
        password_hash=hash_password(
            payload.password
        ),


        role="customer"
    )


    db.add(user)

    db.commit()

    db.refresh(user)


    return UserRead(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
    )



# ==========================
# UPDATE USER
# ==========================
@router.put(
    "/{user_id}",
    response_model=UserRead
)
def update_user(
    user_id: int,
    payload: UserUpdate,
    db: Session = Depends(get_db),
):

    user = (
        db.query(UserDB)
        .filter(
            UserDB.id == user_id
        )
        .first()
    )


    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    if payload.email:
        user.email = payload.email


    if payload.full_name:
        user.full_name = payload.full_name


    if payload.password:

        user.password_hash = hash_password(
            payload.password
        )


    if payload.role:

        user.role = payload.role



    db.commit()

    db.refresh(user)


    return UserRead(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
    )



# ==========================
# DELETE USER
# ==========================
@router.delete(
    "/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
):

    user = (
        db.query(UserDB)
        .filter(
            UserDB.id == user_id
        )
        .first()
    )


    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    db.delete(user)

    db.commit()

# profile
from schemas.user import ChangePasswordRequest
from utils.security import verify_password, hash_password

@router.put("/{user_id}/change-password")
def change_password(
    user_id: int,
    payload: ChangePasswordRequest,
    db: Session = Depends(get_db),
):
    user = (
        db.query(UserDB)
        .filter(UserDB.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if not verify_password(
        payload.old_password,
        user.password_hash,
    ):
        raise HTTPException(
            status_code=400,
            detail="Current password is incorrect"
        )

    user.password_hash = hash_password(
        payload.new_password
    )

    db.commit()

    return {
        "message": "Password updated successfully"
    }