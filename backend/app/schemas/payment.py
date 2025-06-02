from pydantic import BaseModel
from datetime import date

class PaymentBase(BaseModel):
    invoice_id: str
    method: str
    payment_date: date
    amount: float

class PaymentCreate(PaymentBase):
    pass

class PaymentOut(PaymentBase):
    id: str

    class Config:
        from_attributes = True