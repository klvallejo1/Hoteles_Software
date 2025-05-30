from pydantic import BaseModel

class ClientBase(BaseModel):
    name: str
    email: str
    phone: str

class ClientCreate(ClientBase):
    pass

class ClientOut(ClientBase):
    id: str

    class Config:
        from_attributes = True
