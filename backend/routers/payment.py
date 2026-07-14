from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db

from models.payment import PaymentDB
from models.order import OrderDB

from schemas.payment import (
    PaymentCreate,
    PaymentRead,
    PaymentConfirm,
)
from datetime import datetime
from zoneinfo import ZoneInfo
from fastapi import Request
import stripe



from config import (
    STRIPE_SECRET_KEY,
    STRIPE_SUCCESS_URL,
    STRIPE_CANCEL_URL,
    STRIPE_WEBHOOK_SECRET,
)

stripe.api_key = STRIPE_SECRET_KEY

router = APIRouter(
    prefix="/payments",
    tags=["Payments"],
)


# ==========================
# CREATE PAYMENT
# ==========================

@router.post("", response_model=PaymentRead)
def create_payment(
    payload: PaymentCreate,
    db: Session = Depends(get_db),
):
    order = (
        db.query(OrderDB)
        .filter(OrderDB.id == payload.order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found",
        )
    payment = (
        db.query(PaymentDB)
        .filter(PaymentDB.order_id == order.id)
        .first()
    )

    if payment:
        raise HTTPException(
            status_code=400,
            detail="Payment already exists",
        )

    payment = PaymentDB(
    order_id=order.id,
    payment_method=payload.payment_method,
    amount=order.total_price,
    status="Pending",
    transaction_code=str(uuid4()),
)

    db.add(payment)
    db.commit()
    db.refresh(payment)

    return payment


# ==========================
# GET PAYMENT BY ORDER
# ==========================

@router.get("/order/{order_id}", response_model=PaymentRead)
def get_payment(
    order_id: int,
    db: Session = Depends(get_db),
):
    payment = (
        db.query(PaymentDB)
        .filter(PaymentDB.order_id == order_id)
        .first()
    )

    if not payment:
        raise HTTPException(
            status_code=404,
            detail="Payment not found",
        )

    return payment


# ==========================
# UPDATE PAYMENT STATUS
# ==========================

@router.put("/{payment_id}")
def update_payment_status(
    payment_id: int,
    status: str,
    db: Session = Depends(get_db),
):
    payment = (
        db.query(PaymentDB)
        .filter(PaymentDB.id == payment_id)
        .first()
    )

    if not payment:
        raise HTTPException(
            status_code=404,
            detail="Payment not found",
        )

    payment.status = status

    # Nếu thanh toán thành công thì cập nhật Order
    if status == "Paid":
        order = (
            db.query(OrderDB)
            .filter(OrderDB.id == payment.order_id)
            .first()
        )

        if order:
            order.status = "Paid"
    payment.updated_at = datetime.now(
    ZoneInfo("Asia/Ho_Chi_Minh")
)
    db.commit()

    return {
        "message": "Payment updated successfully"
    }

@router.get("", response_model=list[PaymentRead])
def get_all_payments(
    db: Session = Depends(get_db),
):
    return db.query(PaymentDB).all()

# ==========================
# STRIPE CHECKOUT
# ==========================

@router.post("/stripe/create-session")
def create_checkout_session(
    payload: PaymentCreate,
    db: Session = Depends(get_db),
):
    # Kiểm tra Order
    order = (
        db.query(OrderDB)
        .filter(OrderDB.id == payload.order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found",
        )

    if order.status == "Paid":
        raise HTTPException(
            status_code=400,
            detail="Order already paid",
        )

    try:
        # Tạo Stripe Checkout Session
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="payment",
            metadata={
                "order_id": str(order.id),
            },
            line_items=[
                {
                    "price_data": {
                        "currency": "usd",
                        "product_data": {
                            "name": f"ShopHub Order #{order.id}",
                        },
                        "unit_amount": int(order.total_price * 100),
                    },
                    "quantity": 1,
                }
            ],
            success_url=f"{STRIPE_SUCCESS_URL}?order_id={order.id}",
            cancel_url=f"{STRIPE_CANCEL_URL}?order_id={order.id}",
        )

        # Kiểm tra Payment đã tồn tại chưa
        payment = (
            db.query(PaymentDB)
            .filter(PaymentDB.order_id == order.id)
            .first()
        )

        # Nếu chưa có thì tạo mới
        if not payment:
            payment = PaymentDB(
                order_id=order.id,
                payment_method="stripe",
                amount=order.total_price,
                status="Pending",
                transaction_code=session.id,
            )
            db.add(payment)

        # Nếu đã có thì cập nhật Session ID
        else:
            payment.payment_method = "stripe"
            payment.transaction_code = session.id

        db.commit()

        return {
            "url": session.url
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )
# ==========================
# STRIPE WEBHOOK
# ==========================

# ENDPOINT_SECRET = "whsec_5559437ce4fd919cf82a52fe9fe5fcd7d2981a715c86c7e10a4b483f69a7ed77"
ENDPOINT_SECRET = STRIPE_WEBHOOK_SECRET

@router.post("/stripe/webhook")
async def stripe_webhook(
    request: Request,
    db: Session = Depends(get_db),
):
    payload = await request.body()

    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload,
            sig_header,
            ENDPOINT_SECRET,
        )

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid webhook",
        )

    # Thanh toán thành công
    if event["type"] == "checkout.session.completed":

        session = event["data"]["object"]

        order_id = int(session["metadata"]["order_id"])

        payment = (
            db.query(PaymentDB)
            .filter(PaymentDB.order_id == order_id)
            .first()
        )

        if payment and payment.status != "Paid":

            payment.status = "Paid"

            payment.transaction_code = session["id"]

            payment.updated_at = datetime.now(
                ZoneInfo("Asia/Ho_Chi_Minh")
            )
            order = (
                db.query(OrderDB)
                .filter(OrderDB.id == order_id)
                .first()
            )

            if order and order.status != "Paid":
                order.status = "Paid"
                order.updated_at = datetime.now(
                ZoneInfo("Asia/Ho_Chi_Minh")
            )
            db.commit()

    return {
        "received": True
    }

@router.post("/confirm")
def confirm_payment(
    payload: PaymentConfirm,
    db: Session = Depends(get_db),
):
    order = (
        db.query(OrderDB)
        .filter(OrderDB.id == payload.order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found",
        )

    payment = (
        db.query(PaymentDB)
        .filter(PaymentDB.order_id == order.id)
        .first()
    )

    if payment and payment.status != "Paid":

        payment.payment_method = payload.provider

        payment.status = "Paid"

        payment.updated_at = datetime.now(
            ZoneInfo("Asia/Ho_Chi_Minh")
        )

    if order.status != "Paid":
        order.status = "Paid"

    db.commit()

    return {
        "message": "Payment confirmed",
        "order_id": order.id,
        "provider": payload.provider,
    }