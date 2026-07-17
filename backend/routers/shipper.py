from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from zoneinfo import ZoneInfo

from database import get_db
from dependencies import get_current_user
import random
from datetime import datetime
from zoneinfo import ZoneInfo
from models.user import UserDB
from models.order import OrderDB
from schemas.order import OrderRead, OrderItemRead, ShipperDashboard
from fastapi import UploadFile, File
import shutil
import os
from schemas.order import VerifyOTP
router = APIRouter(
    prefix="/shipper",
    tags=["Shipper"],
)
@router.get(
    "/dashboard",
    response_model=ShipperDashboard,
)
def dashboard(
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    if current_user.role != "shipper":
        raise HTTPException(403, "Permission denied")

    waiting_orders = db.query(OrderDB).filter(
        OrderDB.shipper_id == current_user.id,
        OrderDB.status == "WaitingPickup",
    ).count()

    delivering_orders = db.query(OrderDB).filter(
        OrderDB.shipper_id == current_user.id,
        OrderDB.status.in_(["PickedUp", "Shipping"]),
    ).count()

    delivered_orders = db.query(OrderDB).filter(
        OrderDB.shipper_id == current_user.id,
        OrderDB.status == "Delivered",
    ).count()

    failed_orders = db.query(OrderDB).filter(
        OrderDB.shipper_id == current_user.id,
        OrderDB.status == "Failed",
    ).count()

    income_orders = db.query(OrderDB).filter(
        OrderDB.shipper_id == current_user.id,
        OrderDB.status == "Delivered",
    ).all()

    total_income = sum(order.delivery_fee for order in income_orders)

    return ShipperDashboard(
        waiting_orders=waiting_orders,
        delivering_orders=delivering_orders,
        delivered_orders=delivered_orders,
        failed_orders=failed_orders,
        total_income=total_income,
    )

@router.get(
    "/my-orders",
    response_model=list[OrderRead],
)
def my_orders(
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    if current_user.role != "shipper":
        raise HTTPException(403, "Permission denied")

    orders = (
        db.query(OrderDB)
        .filter(OrderDB.shipper_id == current_user.id)
        .order_by(OrderDB.created_at.desc())
        .all()
    )

    result = []

    for order in orders:

        items = [
            OrderItemRead(
                id=item.id,
                product_id=item.product_id,
                quantity=item.quantity,
                price=item.price,
            )
            for item in order.items
        ]

        result.append(
            OrderRead(
                id=order.id,
                user_id=order.user_id,
                full_name=order.full_name,
                phone=order.phone,
                address=order.address,
                payment_method=order.payment_method,
                total_price=order.total_price,
                status=order.status,
                shipper_id=order.shipper_id,
                shipper_name=order.shipper_name,
                accepted_at=order.accepted_at,
                pickup_at=order.pickup_at,
                shipping_at=order.shipping_at,
                delivered_at=order.delivered_at,
                failed_at=order.failed_at,
                delivery_note=order.delivery_note,
                failure_reason=order.failure_reason,
                proof_image=order.proof_image,
                otp_code=order.otp_code,
                delivery_fee=order.delivery_fee,
                created_at=order.created_at,
                updated_at=order.updated_at,
                items=items,
            )
        )

    return result


@router.put("/pickup/{order_id}")
def pickup_order(
    order_id: int,
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    order = db.query(OrderDB).filter(
        OrderDB.id == order_id,
        OrderDB.shipper_id == current_user.id,
    ).first()

    if not order:
        raise HTTPException(404, "Order not found")

    if order.status != "WaitingPickup":
        raise HTTPException(400, "Invalid order status")

    order.status = "PickedUp"

    order.pickup_at = datetime.now(
        ZoneInfo("Asia/Ho_Chi_Minh")
    )

    db.commit()

    return {
        "message": "Order picked up"
    }

@router.put("/shipping/{order_id}")
def shipping_order(
    order_id: int,
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    order = db.query(OrderDB).filter(
        OrderDB.id == order_id,
        OrderDB.shipper_id == current_user.id,
    ).first()

    if not order:
        raise HTTPException(404, "Order not found")

    if order.status != "PickedUp":
        raise HTTPException(400, "Order has not been picked up")

    order.status = "Shipping"

    order.shipping_at = datetime.now(
        ZoneInfo("Asia/Ho_Chi_Minh")
    )
# Sinh OTP khi bắt đầu giao
    order.otp_code = str(random.randint(100000, 999999))

    db.commit()
    db.refresh(order)

    return {
        "message": "Shipping started",
        "otp": order.otp_code,
    }

    db.commit()

    return {
        "message": "Order is now shipping"
    }

@router.put("/deliver/{order_id}")
def deliver_order(
    order_id: int,
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    order = (
        db.query(OrderDB)
        .filter(
            OrderDB.id == order_id,
            OrderDB.shipper_id == current_user.id,
        )
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found",
        )

    if order.status != "Shipping":
        raise HTTPException(
            status_code=400,
            detail="Order is not shipping.",
        )

    order.status = "Delivered"

    order.delivered_at = datetime.now(
        ZoneInfo("Asia/Ho_Chi_Minh")
    )

    db.commit()
    db.refresh(order)

    return {
        "message": "Order delivered successfully."
    }

@router.put("/failed/{order_id}")
def failed_order(
    order_id: int,
    reason: str,
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    order = (
        db.query(OrderDB)
        .filter(
            OrderDB.id == order_id,
            OrderDB.shipper_id == current_user.id,
        )
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found",
        )

    if order.status != "Shipping":
        raise HTTPException(
            status_code=400,
            detail="Order is not shipping.",
        )

    order.status = "Failed"

    order.failure_reason = reason

    order.failed_at = datetime.now(
        ZoneInfo("Asia/Ho_Chi_Minh")
    )

    db.commit()
    db.refresh(order)

    return {
        "message": "Delivery failed."
    }

@router.get(
    "/order/{order_id}",
    response_model=OrderRead,
)
def get_order_detail(
    order_id: int,
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    order = (
        db.query(OrderDB)
        .filter(
            OrderDB.id == order_id,
            OrderDB.shipper_id == current_user.id,
        )
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found",
        )

    items = [
        OrderItemRead(
            id=item.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.price,
        )
        for item in order.items
    ]

    return OrderRead(
        id=order.id,
        user_id=order.user_id,

        full_name=order.full_name,
        phone=order.phone,
        address=order.address,

        payment_method=order.payment_method,

        total_price=order.total_price,

        status=order.status,

        shipper_id=order.shipper_id,
        shipper_name=order.shipper_name,

        accepted_at=order.accepted_at,
        pickup_at=order.pickup_at,
        shipping_at=order.shipping_at,
        delivered_at=order.delivered_at,
        failed_at=order.failed_at,

        delivery_note=order.delivery_note,
        failure_reason=order.failure_reason,

        proof_image=order.proof_image,

        otp_code=order.otp_code,

        delivery_fee=order.delivery_fee,

        created_at=order.created_at,
        updated_at=order.updated_at,

        items=items,
    )

@router.get(
    "/history",
    response_model=list[OrderRead],
)
def history(
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    orders = (
        db.query(OrderDB)
        .filter(
            OrderDB.shipper_id == current_user.id,
            OrderDB.status.in_(["Delivered", "Failed"]),
        )
        .order_by(
            OrderDB.created_at.desc()
        )
        .all()
    )

    result = []

    for order in orders:

        items = [
            OrderItemRead(
                id=item.id,
                product_id=item.product_id,
                quantity=item.quantity,
                price=item.price,
            )
            for item in order.items
        ]

        result.append(
            OrderRead(
                id=order.id,
                user_id=order.user_id,
                full_name=order.full_name,
                phone=order.phone,
                address=order.address,
                payment_method=order.payment_method,
                total_price=order.total_price,
                status=order.status,
                shipper_id=order.shipper_id,
                shipper_name=order.shipper_name,
                accepted_at=order.accepted_at,
                pickup_at=order.pickup_at,
                shipping_at=order.shipping_at,
                delivered_at=order.delivered_at,
                failed_at=order.failed_at,
                delivery_note=order.delivery_note,
                failure_reason=order.failure_reason,
                proof_image=order.proof_image,
                otp_code=order.otp_code,
                delivery_fee=order.delivery_fee,
                created_at=order.created_at,
                updated_at=order.updated_at,
                items=items,
            )
        )

    return result

@router.post("/upload-proof/{order_id}")
def upload_proof(
    order_id: int,
    image: UploadFile = File(...),
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    order = (
        db.query(OrderDB)
        .filter(
            OrderDB.id == order_id,
            OrderDB.shipper_id == current_user.id,
        )
        .first()
    )

    if not order:
        raise HTTPException(404, "Order not found")

    os.makedirs("uploads", exist_ok=True)

    filename = f"{order.id}_{image.filename}"

    path = f"uploads/{filename}"

    with open(path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    order.proof_image = f"/uploads/{filename}"

    db.commit()

    return {
        "message": "Upload successful",
        "image": order.proof_image
    }

@router.put("/verify-otp/{order_id}")
def verify_otp(
    order_id: int,
    payload: VerifyOTP,
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    order = (
        db.query(OrderDB)
        .filter(
            OrderDB.id == order_id,
            OrderDB.shipper_id == current_user.id,
        )
        .first()
    )

    if not order:
        raise HTTPException(404, "Order not found")

    if order.otp_code != payload.otp_code:
        raise HTTPException(
            400,
            "OTP incorrect"
        )

    order.status = "Delivered"

    order.delivered_at = datetime.now(
        ZoneInfo("Asia/Ho_Chi_Minh")
    )

    db.commit()

    return {
        "message": "Verified successfully"
    }

@router.get("/income/today")
def today_income(
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    today = datetime.now(
        ZoneInfo("Asia/Ho_Chi_Minh")
    ).date()

    orders = (
        db.query(OrderDB)
        .filter(
            OrderDB.shipper_id == current_user.id,
            OrderDB.status == "Delivered",
        )
        .all()
    )

    income = 0

    for order in orders:

        if (
            order.delivered_at
            and order.delivered_at.date() == today
        ):
            income += order.delivery_fee

    return {
        "income": income
    }

@router.get("/income/month")
def month_income(
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    now = datetime.now(
        ZoneInfo("Asia/Ho_Chi_Minh")
    )

    orders = (
        db.query(OrderDB)
        .filter(
            OrderDB.shipper_id == current_user.id,
            OrderDB.status == "Delivered",
        )
        .all()
    )

    income = 0

    for order in orders:

        if (
            order.delivered_at
            and order.delivered_at.month == now.month
            and order.delivered_at.year == now.year
        ):
            income += order.delivery_fee

    return {
        "income": income
    }

@router.get("/profile")
def profile(
    current_user: UserDB = Depends(get_current_user),
):

    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "role": current_user.role,
    }