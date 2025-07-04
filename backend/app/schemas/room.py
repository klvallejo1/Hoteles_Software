from pydantic import BaseModel, ConfigDict
from enum import Enum

class RoomStatus(str, Enum):
    disponible = "disponible"
    ocupada = "ocupada"
    mantenimiento = "mantenimiento"

class RoomBase(BaseModel):
    room_type: str
    rate: float
    status: RoomStatus = RoomStatus.disponible

class RoomCreate(RoomBase):
    pass

class RoomOut(RoomBase):
    id: int
    model_config = ConfigDict(from_attributes=True)