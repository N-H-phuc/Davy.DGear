from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from datetime import datetime
from zoneinfo import ZoneInfo

from database import Base


class OrderDB(Base):
    __tablename__ = "orders"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    # ==========================
    # Customer
    # ==========================
    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    full_name = Column(
        String(100),
        nullable=False,
    )

    phone = Column(
        String(20),
        nullable=False,
    )

    address = Column(
        String(255),
        nullable=False,
    )

    # ==========================
    # Payment
    # ==========================
    payment_method = Column(
        String(50),
        default="COD",
    )

    total_price = Column(
        Float,
        nullable=False,
    )

    # ==========================
    # Order Status
    # ==========================
    status = Column(
        String(50),
        default="Pending",
    )

    """
    Pending
    Confirmed
    WaitingPickup
    PickedUp
    Shipping
    Delivered
    Failed
    Cancelled
    Returned
    """

    # ==========================
    # Shipper
    # ==========================
    shipper_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True,
    )

    shipper_name = Column(
        String(100),
        nullable=True,
    )

    accepted_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    pickup_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    shipping_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    delivered_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    failed_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    # ==========================
    # Delivery
    # ==========================
    delivery_note = Column(
        String(500),
        nullable=True,
    )

    failure_reason = Column(
        String(500),
        nullable=True,
    )

    proof_image = Column(
        String(255),
        nullable=True,
    )

    otp_code = Column(
        String(6),
        nullable=True,
    )

    delivery_fee = Column(
        Float,
        default=30000,
    )

    # ==========================
    # Time
    # ==========================
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

    # ==========================
    # Relationships
    # ==========================
    user = relationship(
        "UserDB",
        foreign_keys=[user_id],
        back_populates="orders",
    )

    shipper = relationship(
        "UserDB",
        foreign_keys=[shipper_id],
    )

    items = relationship(
        "OrderItemDB",
        back_populates="order",
        cascade="all, delete",
    )

    payment = relationship(
        "PaymentDB",
        back_populates="order",
        uselist=False,
        cascade="all, delete-orphan",
    )