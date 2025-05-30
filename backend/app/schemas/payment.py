from pydantic import BaseModel
from datetime import date

class InvoiceBase(BaseModel):
    reservation_id: str
    amount: float
    issue_date: date

class InvoiceCreate(InvoiceBase):
    pass

class InvoiceOut(InvoiceBase):
    id: str

    class Config:
        from_attributes = True