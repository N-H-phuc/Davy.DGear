
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db

from models.product import ProductDB
from models.order_item import OrderItemDB
from models.order import OrderDB
from sqlalchemy import extract

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)

# ==========================
# TOP SELLING PRODUCTS
# ==========================

@router.get("/top-products")
def top_products(
    db: Session = Depends(get_db),
):
    result = (
        db.query(
            ProductDB.id,
            ProductDB.name,
            ProductDB.image_path,
            func.sum(OrderItemDB.quantity).label("sold"),
        )
        .join(
            OrderItemDB,
            ProductDB.id == OrderItemDB.product_id,
        )
        .group_by(
            ProductDB.id,
            ProductDB.name,
            ProductDB.image_path,
        )
        .order_by(
            func.sum(OrderItemDB.quantity).desc()
        )
        .limit(5)
        .all()
    )

    return [
        {
            "id": row.id,
            "name": row.name,
            "image_path": row.image_path,
            "sold": int(row.sold or 0),
        }
        for row in result
    ]


# ==========================
# TOP CUSTOMERS
# ==========================

@router.get("/top-customers")
def top_customers(
    db: Session = Depends(get_db),
):
    result = (
        db.query(
            OrderDB.user_id,
            OrderDB.full_name,
            func.count(OrderDB.id).label("orders"),
            func.sum(OrderDB.total_price).label("spent"),
        )
        .group_by(
            OrderDB.user_id,
            OrderDB.full_name,
        )
        .order_by(
            func.sum(OrderDB.total_price).desc()
        )
        .limit(5)
        .all()
    )

    return [
        {
            "user_id": row.user_id,
            "full_name": row.full_name,
            "orders": row.orders,
            "spent": float(row.spent),
        }
        for row in result
    ]


# ==========================
# REVENUE BY DAY
# ==========================

@router.get("/revenue-by-day")
def revenue_by_day(
    db: Session = Depends(get_db),
):
    result = (
        db.query(
            func.date(OrderDB.created_at).label("day"),
            func.sum(OrderDB.total_price).label("revenue"),
        )
        .group_by(
            func.date(OrderDB.created_at)
        )
        .order_by(
            func.date(OrderDB.created_at)
        )
        .all()
    )

    return [
        {
            "day": str(row.day),
            "revenue": float(row.revenue),
        }
        for row in result
    ]
# ==========================
# REVENUE BY WEEK
# ==========================

@router.get("/revenue-by-week")
def revenue_by_week(
    db: Session = Depends(get_db),
):
    result = (
        db.query(
            func.date_trunc(
                "week",
                OrderDB.created_at,
            ).label("week"),
            func.sum(
                OrderDB.total_price
            ).label("revenue"),
        )
        .group_by(
            func.date_trunc(
                "week",
                OrderDB.created_at,
            )
        )
        .order_by(
            func.date_trunc(
                "week",
                OrderDB.created_at,
            )
        )
        .all()
    )

    return [
        {
            "week": row.week.strftime("%Y-%m-%d"),
            "revenue": float(row.revenue),
        }
        for row in result
    ]

# ==========================
# REVENUE BY MONTH
# ==========================

@router.get("/revenue-by-month")
def revenue_by_month(
    db: Session = Depends(get_db),
):
    result = (
        db.query(
            extract("month", OrderDB.created_at).label("month"),
            func.sum(OrderDB.total_price).label("revenue"),
        )
        .group_by(
            extract("month", OrderDB.created_at)
        )
        .order_by(
            extract("month", OrderDB.created_at)
        )
        .all()
    )

    return [
        {
            "month": int(row.month),
            "revenue": float(row.revenue or 0),
        }
        for row in result
    ]

# ==========================
# REVENUE BY YEAR
# ==========================

@router.get("/revenue-by-year")
def revenue_by_year(
    db: Session = Depends(get_db),
):
    result = (
        db.query(
            func.extract(
                "year",
                OrderDB.created_at,
            ).label("year"),
            func.sum(
                OrderDB.total_price
            ).label("revenue"),
        )
        .group_by(
            func.extract(
                "year",
                OrderDB.created_at,
            )
        )
        .order_by(
            func.extract(
                "year",
                OrderDB.created_at,
            )
        )
        .all()
    )

    return [
        {
            "year": int(row.year),
            "revenue": float(row.revenue),
        }
        for row in result
    ]

@router.get("/order-status")
def order_status(
    db: Session = Depends(get_db),
):
    result = (
        db.query(
            OrderDB.status,
            func.count(OrderDB.id).label("count"),
        )
        .group_by(
            OrderDB.status,
        )
        .all()
    )

    return [
        {
            "status": row.status,
            "count": row.count,
        }
        for row in result
    ]