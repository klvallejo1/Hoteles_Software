from sqlalchemy import Column, String, ForeignKey, Float, Date,Integer
from sqlalchemy.orm import relationship
from app.database import Base
import uuid
import datetime

class Invoice(Base):
    __tablename__ = "invoices"
    id = Column(Integer, primary_key=True, autoincrement=True)
    reservation_id = Column(Integer, ForeignKey("reservations.id"), nullable=False)
    amount = Column(Float, nullable=False)
    issue_date = Column(Date, default=datetime.date.today)

    reservation = relationship("Reservation")