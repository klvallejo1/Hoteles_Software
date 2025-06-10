from pydantic import BaseModel, ConfigDict

class ClientBase(BaseModel):
    name: str
    email: str
    phone: str

class ClientCreate(ClientBase):
    pass

class ClientOut(ClientBase):
    id: int
    model_config = ConfigDict(from_attributes=True)