from sqlalchemy import Column, String, ForeignKey, Date, Enum
from sqlalchemy.orm import relationship
from app.database import Base
import uuid

class Reservation(Base):
    __tablename__ = "reservations"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    client_id = Column(String, ForeignKey("clients.id"), nullable=False)
    room_id = Column(String, ForeignKey("rooms.id"), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    status = Column(Enum("pendiente", "confirmada", "activa", "completada", "cancelada", name="reservation_status"), default="pendiente")

    client = relationship("Client")
    room = relationship("Room")