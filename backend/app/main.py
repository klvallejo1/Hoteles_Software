print("✅ Cargando archivo: main.py")  
from fastapi import FastAPI
from app.routers import client, room, reservation, invoice, payment
from app import models
from app.database import engine

app = FastAPI(
    title="Hotel Booking API",
    version="1.0.0"
)

app.include_router(client.router)
app.include_router(room.router)
app.include_router(reservation.router)
app.include_router(invoice.router)
app.include_router(payment.router)