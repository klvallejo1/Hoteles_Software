from sqlalchemy import Column, String, ForeignKey, Float, Date
from sqlalchemy.orm import relationship
from app.database import Base
import uuid
import datetime

class Invoice(Base):
    __tablename__ = "invoices"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    reservation_id = Column(String, ForeignKey("reservations.id"), nullable=False)
    amount = Column(Float, nullable=False)
    issue_date = Column(Date, default=datetime.date.today)

    reservation = relationship("Reservation")