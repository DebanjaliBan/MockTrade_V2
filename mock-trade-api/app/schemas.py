from pydantic import BaseModel,validator
from typing import Optional

class OrderCreate(BaseModel):
    instrument: str
    side: str
    qty: int
    price: Optional[float]
    type: str
    tif: str
    trader: str
    account: Optional[str]

    
    @validator("side", "type", "tif")
    def uppercase_fields(cls, v):
        return v.upper()


class OrderResponse(OrderCreate):
    id: str
    status: str
    created_at: Optional[str]

    class Config:
        orm_mode = True
