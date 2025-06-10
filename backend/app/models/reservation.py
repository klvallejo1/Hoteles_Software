from sqlalchemy import Column, String, ForeignKey, Date, Enum,Integer
from sqlalchemy.orm import relationship
from app.database import Base
import uuid

class Reservation(Base):
    __tablename__ = "reservations"
    id = Column(Integer, primary_key=True, autoincrement=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    status = Column(Enum("pendiente", "confirmada", "activa", "completada", "cancelada", name="reservation_status"), default="pendiente")

    client = relationship("Client")
    room = relationship("Room")