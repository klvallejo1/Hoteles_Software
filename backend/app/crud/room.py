from sqlalchemy.orm import Session
from app import models
from app.schemas import room as room_schema

def create_room(db: Session, room: room_schema.RoomCreate):
    db_room = models.Room(**room.model_dump())
    db.add(db_room)
    db.commit()
    db.refresh(db_room)
    return db_room

def get_room(db: Session, room_id:int):
    return db.query(models.Room).filter(models.Room.id == room_id).first()

def get_rooms(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Room).offset(skip).limit(limit).all()

def update_room(db: Session, room_id: int, updated_data: room_schema.RoomCreate):
    db_room = db.query(models.Room).filter(models.Room.id == room_id).first()
    if db_room:
        for key, value in updated_data.model_dump().items():
            setattr(db_room, key, value)
        db.commit()
        db.refresh(db_room)
    return db_room

def delete_room(db: Session, room_id: int):
    room = db.query(models.Room).filter(models.Room.id == room_id).first()
    if room:
        db.delete(room)
        db.commit()
        return True
    return False
