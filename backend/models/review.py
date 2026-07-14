from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from zoneinfo import ZoneInfo
from database import Base


class ReviewDB(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    product_id = Column(
        Integer,
        ForeignKey("products.id"),
        nullable=False,
    )

    rating = Column(
        Integer,
        nullable=False,
    )

    comment = Column(
        String,
        nullable=False,
    )

    image_path = Column(
        String,
        default="",
    )

    created_at = Column(
    DateTime(timezone=True),
    default=lambda: datetime.now(
        ZoneInfo("Asia/Ho_Chi_Minh")
    ),
)

    user = relationship(
    "UserDB",
    back_populates="reviews",
)

    product = relationship(
    "ProductDB",
    back_populates="reviews",
)