from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas import room as room_schema
from app.crud import room as room_crud
from fastapi import HTTPException

router = APIRouter(prefix="/rooms", tags=["rooms"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=room_schema.RoomOut, status_code=201)
def create_room(room: room_schema.RoomCreate, db: Session = Depends(get_db)):
    return room_crud.create_room(db, room)

@router.get("/", response_model=list[room_schema.RoomOut])
def list_rooms(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return room_crud.get_rooms(db, skip, limit)

@router.get("/{room_id}", response_model=room_schema.RoomOut)
def get_room(room_id:int, db: Session = Depends(get_db)):
    return room_crud.get_room(db, room_id)

@router.put("/{room_id}", response_model=room_schema.RoomOut)
def update_room(room_id: int, room: room_schema.RoomCreate, db: Session = Depends(get_db)):
    updated_room = room_crud.update_room(db, room_id, room)
    if not updated_room:
        raise HTTPException(status_code=404, detail="Habitación no encontrada")
    return updated_room

from fastapi import HTTPException

@router.delete("/{room_id}", status_code=204)
def delete_room(room_id: int, db: Session = Depends(get_db)):
    deleted = room_crud.delete_room(db, room_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Room not found")
