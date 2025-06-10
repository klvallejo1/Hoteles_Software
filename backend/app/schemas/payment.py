from pydantic import BaseModel, ConfigDict
from datetime import date

class PaymentBase(BaseModel):
    invoice_id: int
    method: str
    payment_date: date
    amount: float

class PaymentCreate(PaymentBase):
    pass

class PaymentOut(PaymentBase):
    id: int
    model_config = ConfigDict(from_attributes=True)