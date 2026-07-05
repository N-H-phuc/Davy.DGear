from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db

from models.voucher import VoucherDB

from schemas.voucher import (
    VoucherCreate,
    VoucherUpdate,
    VoucherRead,
     VoucherApply,
    VoucherApplyResponse,
)

router = APIRouter(
    prefix="/vouchers",
    tags=["Vouchers"],
)

# ==========================
# GET ALL
# ==========================

@router.get(
    "",
    response_model=list[VoucherRead],
)
def get_vouchers(
    db: Session = Depends(get_db),
):
    return (
        db.query(VoucherDB)
        .order_by(VoucherDB.id.desc())
        .all()
    )


# ==========================
# GET ONE
# ==========================

@router.get(
    "/{voucher_id}",
    response_model=VoucherRead,
)
def get_voucher(
    voucher_id: int,
    db: Session = Depends(get_db),
):
    voucher = (
        db.query(VoucherDB)
        .filter(VoucherDB.id == voucher_id)
        .first()
    )

    if not voucher:
        raise HTTPException(
            status_code=404,
            detail="Voucher not found",
        )

    return voucher


# ==========================
# CREATE
# ==========================

@router.post(
    "",
    response_model=VoucherRead,
    status_code=status.HTTP_201_CREATED,
)
def create_voucher(
    payload: VoucherCreate,
    db: Session = Depends(get_db),
):
    exists = (
    db.query(VoucherDB)
    .filter(VoucherDB.code == payload.code.upper())
    .first()
)

    if exists:
        raise HTTPException(
            status_code=400,
            detail="Voucher code already exists",
        )

    voucher = VoucherDB(
        code=payload.code.upper(),
        discount=payload.discount,
        quantity=payload.quantity,
        is_active=payload.is_active,
        expired_at=payload.expired_at,
    )

    db.add(voucher)

    db.commit()

    db.refresh(voucher)

    return voucher


# ==========================
# UPDATE
# ==========================

@router.put(
    "/{voucher_id}",
    response_model=VoucherRead,
)
def update_voucher(
    voucher_id: int,
    payload: VoucherUpdate,
    db: Session = Depends(get_db),
):
    voucher = (
        db.query(VoucherDB)
        .filter(VoucherDB.id == voucher_id)
        .first()
    )

    if not voucher:
        raise HTTPException(
            status_code=404,
            detail="Voucher not found",
        )

    update_data = payload.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        if key == "code":value = value.upper()
        setattr(voucher, key, value)

    db.commit()

    db.refresh(voucher)

    return voucher


# ==========================
# DELETE
# ==========================

@router.delete(
    "/{voucher_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_voucher(
    voucher_id: int,
    db: Session = Depends(get_db),
):
    voucher = (
        db.query(VoucherDB)
        .filter(VoucherDB.id == voucher_id)
        .first()
    )

    if not voucher:
        raise HTTPException(
            status_code=404,
            detail="Voucher not found",
        )

    db.delete(voucher)

    db.commit()

# ==========================
# APPLY VOUCHER
# ==========================

@router.post(
    "/apply",
    response_model=VoucherApplyResponse,
)
def apply_voucher(
    payload: VoucherApply,
    db: Session = Depends(get_db),
):
    voucher = (
        db.query(VoucherDB)
        .filter(
            VoucherDB.code == payload.code.upper()
        )
        .first()
    )

    if not voucher:
        raise HTTPException(
            status_code=404,
            detail="Voucher not found",
        )

    if not voucher.is_active:
        raise HTTPException(
            status_code=400,
            detail="Voucher is inactive",
        )

    if voucher.quantity <= 0:
        raise HTTPException(
            status_code=400,
            detail="Voucher out of stock",
        )

    if (
        voucher.expired_at
        and voucher.expired_at < datetime.now(timezone.utc)
    ):
        raise HTTPException(
            status_code=400,
            detail="Voucher expired",
        )

    discount_amount = round(
    payload.total_price * voucher.discount / 100,
    2,
)

    final_price = round(
    payload.total_price - discount_amount,
    2,
)

    voucher.quantity -= 1

    db.commit()

    return VoucherApplyResponse(
        code=voucher.code,
        discount_percent=voucher.discount,
        discount_amount=discount_amount,
        final_price=final_price,
    )