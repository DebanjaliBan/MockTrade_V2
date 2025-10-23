from sqlalchemy.orm import Session
from app.models import OrderHdr
from app import schemas
from datetime import datetime
import uuid

def create_order(db: Session, order: dict):
    order_id = str(uuid.uuid4())
    db_order = OrderHdr(
        order_id=order_id,
        instrument_id=order['instrument'],
        side=order['side'].upper(),
        qty=order['qty'],
        limit_price=order['price'],
        type=order['type'].upper(),
        tif=order['tif'].upper(),
        trader_id=order['trader'],
        account_id=order['account'],
        status="NEW",
        created_at=datetime.utcnow()
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    return {
        "id": db_order.order_id,
        "instrument": db_order.instrument_id,
        "side": db_order.side,
        "qty": db_order.qty,
        "price": float(db_order.limit_price) if db_order.limit_price else None,
        "type": db_order.type,
        "tif": db_order.tif,
        "trader": db_order.trader_id,
        "account": db_order.account_id,
        "status": db_order.status,
        "created_at": str(db_order.created_at)
    }

def get_orders(db: Session):
    orders = db.query(OrderHdr).all()
    return [
        {
            "id": o.order_id,
            "instrument": o.instrument_id,
            "side": o.side,
            "qty": o.qty,
            "price": float(o.limit_price) if o.limit_price else None,
            "type": o.type,
            "tif": o.tif,
            "trader": o.trader_id,
            "account": o.account_id,
            "status": o.status,
            "created_at": str(o.created_at)
        }
        for o in orders
    ]


def update_order_status(db: Session, order_id: str, status: str):
    o = db.query(OrderHdr).filter(OrderHdr.order_id == order_id).first()
    if not o:
        return {"error": "not found"}
    o.status = status
    db.commit()
    db.refresh(o)
    return {"id": o.order_id, "status": o.status}


def simulate_fill(db: Session, order_id: str):
    o = db.query(OrderHdr).filter(OrderHdr.order_id == order_id).first()
    if not o:
        return {"error": "not found"}
    o.status = "FILLED"
    from datetime import datetime
    # Ensure model has filled_at column; set if present
    try:
        o.filled_at = datetime.utcnow()
    except Exception:
        pass
    db.commit()
    db.refresh(o)
    return {
        "id": o.order_id,
        "status": o.status,
        "filled_at": str(getattr(o, 'filled_at', ''))
    }