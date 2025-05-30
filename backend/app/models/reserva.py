from sqlalchemy import Column, Integer, String, Date, ForeignKey
from app.database import Base

class Reserva(Base):
    __tablename__ = "reserva"
    pk_reserva = Column(Integer, primary_key=True)
    fecha_inicio = Column(Date, nullable=False)
    fecha_fin = Column(Date, nullable=False)
    estado = Column(String, nullable=False)
    pk_habitacion = Column(Integer, ForeignKey("habitacion.pk_habitacion"), nullable=False)
    pk_client = Column(Integer, ForeignKey("clients.id"), nullable=False)