from pydantic import BaseModel, ConfigDict
from enum import Enum
from datetime import date

class ReservationStatus(str, Enum):
    pendiente = "pendiente"
    confirmada = "confirmada"
    activa = "activa"
    completada = "completada"
    cancelada = "cancelada"

class ReservationBase(BaseModel):
    client_id: int
    room_id: int
    start_date: date
    end_date: date
    status: ReservationStatus = ReservationStatus.pendiente

class ReservationCreate(ReservationBase):
    pass

class ReservationOut(ReservationBase):
    id: int
    model_config = ConfigDict(from_attributes=True)