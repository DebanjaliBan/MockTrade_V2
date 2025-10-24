from sqlalchemy.orm import Session
from app.models import OrderHdr, TradeHdr
from datetime import datetime
import uuid

# ------------------- Order Functions -------------------
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

# ------------------- Trade Functions -------------------
def create_trade(db: Session, trade: dict):
    trade_id = str(uuid.uuid4())
    db_trade = TradeHdr(
        trade_id=trade_id,
        order_id=trade.get('order_id'),
        instrument_id=trade['instrument'],
        side=trade['side'].upper(),
        qty=trade['qty'],
        price=trade['price'],
        trader_id=trade.get('trader'),
        exec_time=trade.get('exec_time', datetime.utcnow()),
        broker_id=trade['broker'],
        account_id=trade['account'],
        status="BOOKED",
        created_at=datetime.utcnow()
    )
    db.add(db_trade)
    db.commit()
    db.refresh(db_trade)
    return {
        "id": db_trade.trade_id,
        "order_id": db_trade.order_id,
        "instrument": db_trade.instrument_id,
        "side": db_trade.side,
        "qty": db_trade.qty,
        "price": float(db_trade.price) if db_trade.price else None,
        "broker": db_trade.broker_id,
        "account": db_trade.account_id,
        "status": db_trade.status,
        "exec_time": str(db_trade.exec_time),
        "created_at": str(db_trade.created_at)
    }

def get_trades(db: Session):
    trades = db.query(TradeHdr).all()
    return [
        {
            "id": t.trade_id,
            "order_id": t.order_id,
            "instrument": t.instrument_id,
            "side": t.side,
            "qty": t.qty,
            "price": float(t.price) if t.price else None,
            "broker": t.broker_id,
            "account": t.account_id,
            "status": t.status,
            "exec_time": str(t.exec_time),
            "created_at": str(t.created_at)
        }
        for t in trades
    ]

def amend_trade(db: Session, trade_id: str, trade: dict):
    t = db.query(TradeHdr).filter(TradeHdr.trade_id == trade_id).first()
    if not t:
        return {"error": "not found"}
    for key, value in trade.items():
        if hasattr(t, key):
            setattr(t, key, value)
    db.commit()
    db.refresh(t)
    return {"id": t.trade_id, "status": t.status}

def update_trade_status(db: Session, trade_id: str, status: str):
    t = db.query(TradeHdr).filter(TradeHdr.trade_id == trade_id).first()
    if not t:
        return {"error": "not found"}
    t.status = status
    db.commit()
    db.refresh(t)
    return {"id": t.trade_id, "status": t.status}