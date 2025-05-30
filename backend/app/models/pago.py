from sqlalchemy import Column, Integer, String, Date, Float, ForeignKey
from app.database import Base

class Pago(Base):
    __tablename__ = "pago"
    pk_pago = Column(Integer, primary_key=True)
    metodo = Column(String, nullable=False)
    fecha_pago = Column(Date, nullable=False)
    monto = Column(Float, nullable=False)
    pk_factura = Column(Integer, ForeignKey("factura.pk_factura"), nullable=False)
    pk_reserva = Column(Integer, ForeignKey("reserva.pk_reserva"), nullable=False)