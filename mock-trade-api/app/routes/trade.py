from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import crud, database

router = APIRouter(prefix="/trade", tags=["Trade"])

@router.post("/")
def create_trade(trade: dict, db: Session = Depends(database.get_db)):
    return crud.create_trade(db=db, trade=trade)

@router.get("/")
def get_trades(db: Session = Depends(database.get_db)):
    return crud.get_trades(db)

@router.post("/{trade_id}/amend")
def amend_trade(trade_id: str, trade: dict, db: Session = Depends(database.get_db)):
    return crud.amend_trade(db, trade_id, trade)

@router.post("/{trade_id}/cancel")
def cancel_trade(trade_id: str, db: Session = Depends(database.get_db)):
    return crud.update_trade_status(db, trade_id, "CANCELLED")
