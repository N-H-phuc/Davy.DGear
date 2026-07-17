from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from database import Base


class UserDB(Base):
    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    email = Column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )

    full_name = Column(
        String(100),
        nullable=False,
    )

    password_hash = Column(
        String(255),
        nullable=False,
    )

    # admin | customer | seller | shipper
    role = Column(
        String(20),
        nullable=False,
        default="customer",
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    # ==========================
    # CUSTOMER ORDERS
    # ==========================
    orders = relationship(
        "OrderDB",
        foreign_keys="OrderDB.user_id",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    # ==========================
    # SHIPPER ORDERS
    # ==========================
    shipping_orders = relationship(
        "OrderDB",
        foreign_keys="OrderDB.shipper_id",
        back_populates="shipper",
    )

    # ==========================
    # WISHLIST
    # ==========================
    wishlist = relationship(
        "WishlistDB",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    # ==========================
    # REVIEWS
    # ==========================
    reviews = relationship(
        "ReviewDB",
        back_populates="user",
        cascade="all, delete-orphan",
    )