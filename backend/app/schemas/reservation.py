from pydantic import BaseModel, ConfigDict
from enum import Enum
from datetime import date
from typing import Optional

class ReservationStatus(str, Enum):
    pendiente = "pendiente"
    confirmada = "confirmada"
    activa = "activa"
    completada = "completada"
    cancelada = "cancelada"

# Esquemas simples para evitar importaciones circulares
class ClientSimple(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class RoomSimple(BaseModel):
    id: int
    room_type: str
    rate: float
    status: str
    model_config = ConfigDict(from_attributes=True)

class ReservationBase(BaseModel):
    client_id: int
    room_id: int
    start_date: date
    end_date: date
    status: ReservationStatus = ReservationStatus.pendiente
    total_amount: Optional[float] = None

class ReservationCreate(ReservationBase):
    pass

class ReservationOut(ReservationBase):
    id: int
    client: Optional[ClientSimple] = None
    room: Optional[RoomSimple] = None
    model_config = ConfigDict(from_attributes=True)