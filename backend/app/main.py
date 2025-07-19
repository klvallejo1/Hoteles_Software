print("✅ Cargando archivo: main.py")  
from fastapi import FastAPI
from app.routers import client, room, reservation, invoice, payment, room_availability
from app import models
from app.database import Base, engine
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Sistema de Gestión Hotelera",
    description="API para la gestión de reservas, clientes, habitaciones, facturación y pagos en un hotel.",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crear las tablas
Base.metadata.create_all(bind=engine)

# Incluir los routers
app.include_router(client.router)
app.include_router(room.router)
app.include_router(reservation.router)
app.include_router(invoice.router)
app.include_router(payment.router)
app.include_router(room_availability.router)