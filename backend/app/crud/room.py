from sqlalchemy.orm import Session
from app import models, schemas

def create_room(db: Session, room: schemas.room.RoomCreate):
    db_room = models.room.Room(**room.dict())
    db.add(db_room)
    db.commit()
    db.refresh(db_room)
    return db_room

def get_room(db: Session, room_id: str):
    return db.query(models.room.Room).filter(models.room.Room.id == room_id).first()

def get_rooms(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.room.Room).offset(skip).limit(limit).all()