print("✅ Cargando archivo: main.py")  
from fastapi import FastAPI
from app.routers import client, room, reservation, invoice, payment
from app import models
from app.database import Base, engine

app = FastAPI(
    title="Sistema de Gestión Hotelera",
    description="API para la gestión de reservas, clientes, habitaciones, facturación y pagos en un hotel.",
    version="1.0.0"
)

Base.metadata.create_all(bind=engine)

app.include_router(client.router)
app.include_router(room.router)
app.include_router(reservation.router)
app.include_router(invoice.router)
app.include_router(payment.router)