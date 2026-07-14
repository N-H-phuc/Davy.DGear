from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    ForeignKey,
    DateTime,
)
from sqlalchemy.orm import relationship
from datetime import datetime
from zoneinfo import ZoneInfo
from database import Base


class PaymentDB(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True)

    order_id = Column(
        Integer,
        ForeignKey("orders.id", ondelete="CASCADE"),
        nullable=False,
    )

    # stripe | paypal | vnpay
    payment_method = Column(
        String,
        nullable=False,
    )

    amount = Column(
        Float,
        nullable=False,
    )

    # Thêm dòng này nếu muốn giống đề
    currency = Column(
        String,
        default="usd",
    )

    status = Column(
        String,
        default="Pending",
    )

    # Stripe Session ID / PayPal Order ID / VNPay TxnRef
    transaction_code = Column(
        String,
        nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(
            ZoneInfo("Asia/Ho_Chi_Minh")
        ),
    )

    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(
            ZoneInfo("Asia/Ho_Chi_Minh")
        ),
        onupdate=lambda: datetime.now(
            ZoneInfo("Asia/Ho_Chi_Minh")
        ),
    )

    order = relationship(
        "OrderDB",
        back_populates="payment",
    )