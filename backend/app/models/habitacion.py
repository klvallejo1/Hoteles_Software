from sqlalchemy import Column, Integer, String, Float
from app.database import Base

class Habitacion(Base):
    __tablename__ = "habitacion"
    pk_habitacion = Column(Integer, primary_key=True)
    tipo = Column(String, nullable=False)
    tarifa = Column(Float, nullable=False)
    estado = Column(String, nullable=False)