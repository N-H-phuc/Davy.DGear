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

from schemas.user import (
    ShipperCreate,
    ShipperUpdate,
    ShipperRead,
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
# GET ALL SHIPPERS
# ==========================

@router.get("/shippers", response_model=list[ShipperRead])
def get_shippers(
    db: Session = Depends(get_db),
):
    shippers = (
        db.query(UserDB)
        .filter(UserDB.role == "shipper")
        .all()
    )

    return [
        ShipperRead(
            id=shipper.id,
            email=shipper.email,
            full_name=shipper.full_name,
            role=shipper.role,
        )
        for shipper in shippers
    ]

# ==========================
# CREATE SHIPPER
# ==========================

@router.post(
    "/shippers",
    response_model=ShipperRead,
    status_code=status.HTTP_201_CREATED,
)
def create_shipper(
    payload: ShipperCreate,
    db: Session = Depends(get_db),
):

    exists = (
        db.query(UserDB)
        .filter(UserDB.email == payload.email)
        .first()
    )

    if exists:
        raise HTTPException(
            status_code=400,
            detail="Email already exists",
        )

    shipper = UserDB(
        email=payload.email,
        full_name=payload.full_name,
        password_hash=hash_password(payload.password),
        role="shipper",
    )

    db.add(shipper)
    db.commit()
    db.refresh(shipper)

    return ShipperRead(
        id=shipper.id,
        email=shipper.email,
        full_name=shipper.full_name,
        role=shipper.role,
    )

# ==========================
# UPDATE SHIPPER
# ==========================

@router.put(
    "/shippers/{shipper_id}",
    response_model=ShipperRead,
)
def update_shipper(
    shipper_id: int,
    payload: ShipperUpdate,
    db: Session = Depends(get_db),
):

    shipper = (
        db.query(UserDB)
        .filter(
            UserDB.id == shipper_id,
            UserDB.role == "shipper",
        )
        .first()
    )

    if not shipper:
        raise HTTPException(
            status_code=404,
            detail="Shipper not found",
        )

    if payload.email:
        shipper.email = payload.email

    if payload.full_name:
        shipper.full_name = payload.full_name

    if payload.password:
        shipper.password_hash = hash_password(
            payload.password
        )

    db.commit()
    db.refresh(shipper)

    return ShipperRead(
        id=shipper.id,
        email=shipper.email,
        full_name=shipper.full_name,
        role=shipper.role,
    )

# ==========================
# DELETE SHIPPER
# ==========================

@router.delete(
    "/shippers/{shipper_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_shipper(
    shipper_id: int,
    db: Session = Depends(get_db),
):

    shipper = (
        db.query(UserDB)
        .filter(
            UserDB.id == shipper_id,
            UserDB.role == "shipper",
        )
        .first()
    )

    if not shipper:
        raise HTTPException(
            status_code=404,
            detail="Shipper not found",
        )

    db.delete(shipper)
    db.commit()

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

