
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from datetime import datetime
from zoneinfo import ZoneInfo
from models.order import OrderDB
from models.order_item import OrderItemDB
from models.product import ProductDB

from schemas.order import (
    OrderCreate,
    OrderRead,
    OrderItemRead,
)
# import random
from dependencies import get_current_user
from models.user import UserDB

router = APIRouter(
    prefix="/orders",
    tags=["Orders"],
)

# tk xem đc đơn hàng của mình thôi
@router.get("/my", response_model=list[OrderRead])
def get_my_orders(
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    orders = (
    db.query(OrderDB)
    .filter(OrderDB.user_id == current_user.id)
    .order_by(OrderDB.created_at.desc())
    .all()
)

    result = []

    for order in orders:

        items = []

        for item in order.items:

            items.append(
                OrderItemRead(
                    id=item.id,
                    product_id=item.product_id,
                    quantity=item.quantity,
                    price=item.price,
                )
            )

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

@router.get("/shipping", response_model=list[OrderRead])
def get_shipping_orders(
    db: Session = Depends(get_db),
):
    orders = (
        db.query(OrderDB)
        .order_by(OrderDB.created_at.desc())
        .all()
    )

    result = []

    for order in orders:
        items = []

        for item in order.items:
            items.append(
                OrderItemRead(
                    id=item.id,
                    product_id=item.product_id,
                    quantity=item.quantity,
                    price=item.price,
                )
            )

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

@router.put("/assign-shipper/{order_id}")
def assign_shipper(
    order_id: int,
    shipper_id: int,
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # print("ID:", current_user.id)
    # print("EMAIL:", current_user.email)
    # print("ROLE:", current_user.role)
    # Chỉ admin mới được gán
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Permission denied",
        )

    order = (
        db.query(OrderDB)
        .filter(OrderDB.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found",
        )

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

    order.shipper_id = shipper.id
    order.shipper_name = shipper.full_name

    order.status = "WaitingPickup"

    order.accepted_at = datetime.now(
        ZoneInfo("Asia/Ho_Chi_Minh")
    )

    db.commit()
    db.refresh(order)

    return {
        "message": "Assign shipper successfully"
    }
# ==========================
# GET ALL ORDERS
# ==========================

@router.get(
    "",
    response_model=list[OrderRead],
)
def get_orders(
    db: Session = Depends(get_db),
):

    orders = (
    db.query(OrderDB)
    .order_by(OrderDB.created_at.desc())
    .all()
)

    result = []

    for order in orders:

        items = []

        for item in order.items:

            items.append(
                OrderItemRead(
                    id=item.id,
                    product_id=item.product_id,
                    quantity=item.quantity,
                    price=item.price,
                )
            )

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


# ==========================
# GET ORDER BY ID
# ==========================

@router.get(
    "/{order_id}",
    response_model=OrderRead,
)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
):

    order = (
        db.query(OrderDB)
        .filter(OrderDB.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found",
        )

    items = []

    for item in order.items:

        items.append(
            OrderItemRead(
                id=item.id,
                product_id=item.product_id,
                quantity=item.quantity,
                price=item.price,
            )
        )

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





# ==========================
# CREATE ORDER (CHECKOUT)
# ==========================

@router.post(
    "",
    response_model=OrderRead,
    status_code=status.HTTP_201_CREATED,
)
def create_order(
    payload: OrderCreate,
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    total_price = 0

    # Kiểm tra sản phẩm và tính tổng tiền
    products = []

    for item in payload.items:

        product = (
            db.query(ProductDB)
            .filter(ProductDB.id == item.product_id)
            .first()
        )

        if not product:
            raise HTTPException(
                status_code=404,
                detail=f"Product {item.product_id} not found",
            )

        if product.stock < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"{product.name} only has {product.stock} item(s) left in stock.",
            )

        # Lấy giá từ database
        price = product.price

        total_price += price * item.quantity

        products.append(
            {
                "product": product,
                "quantity": item.quantity,
                "price": price,
            }
        )
    # otp = str(random.randint(100000, 999999))
    delivery_fee = max(5, total_price * 0.05)
    order = OrderDB(
        user_id=current_user.id,
        full_name=payload.full_name,
        phone=payload.phone,
        address=payload.address,
        payment_method=payload.payment_method,
        total_price=total_price,
        status="Pending",
        shipper_id=None,
        shipper_name=None,
        # otp_code=otp,
        delivery_fee=delivery_fee,
    )

    db.add(order)
    db.flush()

    # Tạo Order Items
    for item in products:

        order_item = OrderItemDB(
            order_id=order.id,
            product_id=item["product"].id,
            quantity=item["quantity"],
            price=item["price"],
        )

        db.add(order_item)

        # Cập nhật tồn kho
        item["product"].stock -= item["quantity"]
        item["product"].sold += item["quantity"]

    db.commit()
    db.refresh(order)

    items = []

    for item in order.items:
        items.append(
            OrderItemRead(
                id=item.id,
                product_id=item.product_id,
                quantity=item.quantity,
                price=item.price,
            )
        )

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

# ==========================
# UPDATE ORDER STATUS
# ==========================

@router.put("/{order_id}/status")
def update_status(
    order_id: int,
    status_value: str,
    db: Session = Depends(get_db),
):

    order = (
        db.query(OrderDB)
        .filter(OrderDB.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found",
        )

    order.status = status_value

    db.commit()

    return {
        "message": "Order status updated"
    }


# ==========================
# DELETE ORDER
# ==========================

@router.delete(
    "/{order_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_order(
    order_id: int,
    db: Session = Depends(get_db),
):

    order = (
        db.query(OrderDB)
        .filter(OrderDB.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found",
        )

    db.delete(order)

    db.commit()

