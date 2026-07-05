from sqlalchemy import (
    Column,
    Integer,
    Float,
    ForeignKey,
)

from sqlalchemy.orm import relationship

from database import Base


class OrderItemDB(Base):
    __tablename__ = "order_items"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    order_id = Column(
        Integer,
        ForeignKey("orders.id"),
        nullable=False,
    )

    product_id = Column(
        Integer,
        ForeignKey("products.id"),
        nullable=False,
    )

    quantity = Column(
        Integer,
        nullable=False,
        default=1,
    )

    price = Column(
        Float,
        nullable=False,
    )

    order = relationship(
        "OrderDB",
        back_populates="items",
    )

    product = relationship(
    "ProductDB",
    back_populates="order_items",
)