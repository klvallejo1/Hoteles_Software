from pydantic import BaseModel, ConfigDict
from datetime import date

class InvoiceBase(BaseModel):
    reservation_id: int
    amount: float
    issue_date: date

class InvoiceCreate(InvoiceBase):
    pass

class InvoiceOut(InvoiceBase):
    id: int
    model_config = ConfigDict(from_attributes=True)