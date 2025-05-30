from pydantic import BaseModel
from enum import Enum
from datetime import date

class ReservationStatus(str, Enum):
    pendiente = "pendiente"
    confirmada = "confirmada"
    activa = "activa"
    completada = "completada"
    cancelada = "cancelada"

class ReservationBase(BaseModel):
    client_id: str
    room_id: str
    start_date: date
    end_date: date
    status: ReservationStatus = ReservationStatus.pendiente

class ReservationCreate(ReservationBase):
    pass

class ReservationOut(ReservationBase):
    id: str

    class Config:
        from_attributes = True