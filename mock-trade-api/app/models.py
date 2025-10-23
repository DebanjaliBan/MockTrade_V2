from sqlalchemy import Column, String, Integer, Float, Date, ForeignKey, DECIMAL, TIMESTAMP, JSON
from sqlalchemy.orm import declarative_base

Base = declarative_base()

# ---------------- Core Tables ---------------- #

class Instrument(Base):
    __tablename__ = "instrument"
    instrument_id = Column(String, primary_key=True, index=True)
    symbol = Column(String)
    exchange = Column(String)
    product_type = Column(String)
    contract_month = Column(String)
    tick_size = Column(Float)
    tick_value = Column(Float)
    contract_multiplier = Column(Integer)
    status = Column(String)
    expiry_date = Column(Date)

class Account(Base):
    __tablename__ = "account"
    account_id = Column(String, primary_key=True, index=True)
    code = Column(String)
    name = Column(String)
    status = Column(String)

class Broker(Base):
    __tablename__ = "broker"
    broker_id = Column(String, primary_key=True, index=True)
    code = Column(String)
    name = Column(String)
    status = Column(String)

class Trader(Base):
    __tablename__ = "trader"
    trader_id = Column(String, primary_key=True, index=True)
    user_id = Column(String)
    name = Column(String)
    desk = Column(String)

class OrderHdr(Base):
    __tablename__ = "order_hdr"
    order_id = Column(String, primary_key=True, index=True)
    instrument_id = Column(String, ForeignKey("instrument.instrument_id"))
    side = Column(String)
    qty = Column(Integer)
    limit_price = Column(DECIMAL)
    type = Column(String)
    tif = Column(String)
    trader_id = Column(String, ForeignKey("trader.trader_id"))
    account_id = Column(String, ForeignKey("account.account_id"))
    status = Column(String)
    created_at = Column(TIMESTAMP)

class TradeHdr(Base):
    __tablename__ = "trade_hdr"
    trade_id = Column(String, primary_key=True, index=True)
    order_id = Column(String, ForeignKey("order_hdr.order_id"), nullable=True)
    instrument_id = Column(String, ForeignKey("instrument.instrument_id"))
    side = Column(String)
    qty = Column(Integer)
    price = Column(DECIMAL)
    trader_id = Column(String, ForeignKey("trader.trader_id"))
    exec_time = Column(TIMESTAMP)
    broker_id = Column(String, ForeignKey("broker.broker_id"))
    account_id = Column(String, ForeignKey("account.account_id"))
    status = Column(String)
    reversal_of_trade_id = Column(String)
    roll_group_id = Column(String)
    created_at = Column(TIMESTAMP)

class TradeAllocation(Base):
    __tablename__ = "trade_allocation"
    allocation_id = Column(String, primary_key=True, index=True)
    trade_id = Column(String, ForeignKey("trade_hdr.trade_id"))
    account_id = Column(String, ForeignKey("account.account_id"))
    alloc_qty = Column(Integer)
    status = Column(String)

class SettlementPrice(Base):
    __tablename__ = "settlement_price"
    instrument_id = Column(String, ForeignKey("instrument.instrument_id"), primary_key=True)
    val_date = Column(Date, primary_key=True)
    settle_price = Column(DECIMAL)

class FinalSettlementPrice(Base):
    __tablename__ = "final_settlement_price"
    instrument_id = Column(String, ForeignKey("instrument.instrument_id"), primary_key=True)
    val_date = Column(Date, primary_key=True)
    final_price = Column(DECIMAL)

class PositionDaily(Base):
    __tablename__ = "position_daily"
    instrument_id = Column(String, ForeignKey("instrument.instrument_id"), primary_key=True)
    account_id = Column(String, ForeignKey("account.account_id"), primary_key=True)
    val_date = Column(Date, primary_key=True)
    net_qty = Column(Integer)
    open_qty = Column(Integer)
    close_qty = Column(Integer)

class VariationMargin(Base):
    __tablename__ = "variation_margin"
    vm_id = Column(String, primary_key=True, index=True)
    instrument_id = Column(String, ForeignKey("instrument.instrument_id"))
    account_id = Column(String, ForeignKey("account.account_id"))
    val_date = Column(Date)
    prev_settle = Column(DECIMAL)
    today_settle = Column(DECIMAL)
    net_qty = Column(Integer)
    contract_multiplier = Column(Integer)
    vm_amount = Column(DECIMAL)

class EodPnl(Base):
    __tablename__ = "eod_pnl"
    instrument_id = Column(String, ForeignKey("instrument.instrument_id"), primary_key=True)
    account_id = Column(String, ForeignKey("account.account_id"), primary_key=True)
    val_date = Column(Date, primary_key=True)
    realized_pnl = Column(DECIMAL)
    unrealized_pnl = Column(DECIMAL)
    total_pnl = Column(DECIMAL)

class AuditLog(Base):
    __tablename__ = "audit_log"
    audit_id = Column(String, primary_key=True, index=True)
    entity_type = Column(String)
    entity_id = Column(String)
    action = Column(String)
    user_id = Column(String)
    timestamp = Column(TIMESTAMP)
    before_json = Column(JSON)
    after_json = Column(JSON)
    comment = Column(String)