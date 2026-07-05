from sqlalchemy import Column, Integer, String
from database import Base


class CategoryDB(Base):
    __tablename__ = "category"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), unique=True, nullable=False)

    description = Column(String(255), nullable=True)