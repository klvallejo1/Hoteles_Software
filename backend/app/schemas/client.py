from pydantic import BaseModel, ConfigDict
from typing import Optional

class ClientBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None

class ClientCreate(ClientBase):
    pass

class ClientOut(ClientBase):
    id: int
    model_config = ConfigDict(from_attributes=True)