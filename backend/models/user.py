from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from database import Base
from sqlalchemy.orm import relationship

class UserDB(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    email = Column(String(255), unique=True, index=True, nullable=False)

    full_name = Column(String(100), nullable=False)

    password_hash = Column(String(255), nullable=False)

    role = Column(String(20), nullable=False, default="customer")

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    orders = relationship(
        "OrderDB",
        back_populates="user",
        cascade="all, delete",
     )