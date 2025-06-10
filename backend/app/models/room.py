from sqlalchemy import Column, String, Float, Enum,Integer
from app.database import Base
import uuid

class Room(Base):
    __tablename__ = "rooms"
    id = Column(Integer, primary_key=True, autoincrement=True)
    room_type = Column(String, nullable=False)
    rate = Column(Float, nullable=False)
    status = Column(Enum("disponible", "ocupada", "mantenimiento", name="room_status"), default="disponible")