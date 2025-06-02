from sqlalchemy import Column, String, ForeignKey, Float, Date
from sqlalchemy.orm import relationship
from app.database import Base
import uuid
import datetime

class Payment(Base):
    __tablename__ = "payments"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    invoice_id = Column(String, ForeignKey("invoices.id"), nullable=False)
    method = Column(String, nullable=False)
    payment_date = Column(Date, default=datetime.date.today)
    amount = Column(Float, nullable=False)

    invoice = relationship("Invoice")