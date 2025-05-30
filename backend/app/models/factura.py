from sqlalchemy import Column, Integer, String, Date, Float, ForeignKey
from app.database import Base

class Factura(Base):
    __tablename__ = "factura"
    pk_factura = Column(Integer, primary_key=True)
    pk_reserva = Column(Integer, ForeignKey("reserva.pk_reserva"), nullable=False)
    metodo = Column(String, nullable=False)
    fecha_pago = Column(Date, nullable=False)
    monto = Column(Float, nullable=False)