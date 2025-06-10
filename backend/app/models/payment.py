from sqlalchemy import Column, String, ForeignKey, Float, Date,Integer
from sqlalchemy.orm import relationship
from app.database import Base
import uuid
import datetime

class Payment(Base):
    __tablename__ = "payments"
    id = Column(Integer, primary_key=True, autoincrement=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id"), nullable=False)
    method = Column(String, nullable=False)
    payment_date = Column(Date, default=datetime.date.today)
    amount = Column(Float, nullable=False)

    invoice = relationship("Invoice")