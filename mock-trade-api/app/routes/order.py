from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import crud, database

router = APIRouter(prefix="/order", tags=["Order"])

@router.post("/")
def create_order(order: dict, db: Session = Depends(database.get_db)):
    return crud.create_order(db=db, order=order)

@router.get("/")
def get_orders(db: Session = Depends(database.get_db)):
    return crud.get_orders(db)


@router.post("/{order_id}/cancel")
def cancel_order(order_id: str, db: Session = Depends(database.get_db)):
    return crud.update_order_status(db, order_id, "CANCELLED")


@router.post("/{order_id}/simulate_fill")
def simulate_fill(order_id: str, db: Session = Depends(database.get_db)):
    return crud.simulate_fill(db, order_id)