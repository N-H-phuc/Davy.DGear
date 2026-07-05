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

from database import Base


class OrderDB(Base):
    __tablename__ = "orders"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    full_name = Column(
        String,
        nullable=False,
    )

    phone = Column(
        String,
        nullable=False,
    )

    address = Column(
        String,
        nullable=False,
    )

    payment_method = Column(
        String,
        default="COD",
    )

    total_price = Column(
        Float,
        nullable=False,
    )

    status = Column(
        String,
        default="Pending",
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )

    user = relationship(
        "UserDB",
        back_populates="orders",
    )

    items = relationship(
        "OrderItemDB",
        back_populates="order",
        cascade="all, delete",
    )