from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas import client as client_schema
from app.crud import client as client_crud

router = APIRouter(prefix="/clients", tags=["clients"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=client_schema.ClientOut, status_code=201)
def create_client(client: client_schema.ClientCreate, db: Session = Depends(get_db)):
    return client_crud.create_client(db, client)

@router.get("/", response_model=list[client_schema.ClientOut])
def list_clients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return client_crud.get_clients(db, skip, limit)

@router.get("/{client_id}", response_model=client_schema.ClientOut)
def get_client(client_id: int, db: Session = Depends(get_db)):
    client = client_crud.get_client(db, client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return client

@router.put("/{client_id}", response_model=client_schema.ClientOut)
def update_client(client_id: int, client: client_schema.ClientCreate, db: Session = Depends(get_db)):
    updated_client = client_crud.update_client(db, client_id, client)
    if not updated_client:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return updated_client

@router.delete("/{client_id}")
def delete_client(client_id: int, db: Session = Depends(get_db)):
    if not client_crud.delete_client(db, client_id):
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return {"message": "Cliente eliminado exitosamente"}