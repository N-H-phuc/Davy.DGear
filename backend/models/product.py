from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Float
from sqlalchemy import Text
from sqlalchemy import DateTime
from zoneinfo import ZoneInfo
from sqlalchemy import Boolean
from sqlalchemy.sql import func

from sqlalchemy.orm import relationship

from database import Base


class ProductDB(Base):
    __tablename__ = "products"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    name = Column(
        String(100),
        nullable=False,
    )

    # Giá gốc
    price = Column(
        Float,
        nullable=False,
    )

    category = Column(
        String(50),
        nullable=False,
    )

    description = Column(
        Text,
        nullable=False,
    )

    image_path = Column(
        String(255),
        nullable=True,
    )

    # ==========================
    # FLASH SALE
    # ==========================

    is_flash_sale = Column(
        Boolean,
        default=False,
    )

    flash_sale_percent = Column(
        Integer,
        default=0,
    )

    flash_sale_start = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    flash_sale_end = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    # ==========================
    # STATISTICS
    # ==========================

    sold = Column(
        Integer,
        default=0,
    )

    stock = Column(
        Integer,
        default=0,
    )

    # ==========================
    # TIME
    # ==========================

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    # ==========================
    # RELATIONSHIP
    # ==========================

    reviews = relationship(
        "ReviewDB",
        back_populates="product",
        cascade="all, delete-orphan",
    )

    order_items = relationship(
        "OrderItemDB",
        back_populates="product",
    )

    wishlist = relationship(
    "WishlistDB",
    back_populates="product",
    cascade="all, delete-orphan",
)