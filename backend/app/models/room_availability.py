from sqlalchemy import Column, Integer, ForeignKey, Date, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class RoomAvailability(Base):
    __tablename__ = "room_availability"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)
    date = Column(Date, nullable=False)
    is_available = Column(Boolean, default=True)
    reservation_id = Column(Integer, ForeignKey("reservations.id"), nullable=True)
    
    room = relationship("Room")
    reservation = relationship("Reservation")
