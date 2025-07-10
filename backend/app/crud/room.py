from sqlalchemy.orm import Session
from app import models, schemas

def create_room(db: Session, room: schemas.room.RoomCreate):
    db_room = models.room.Room(**room.model_dump())
    db.add(db_room)
    db.commit()
    db.refresh(db_room)
    return db_room

def get_room(db: Session, room_id:int):
    return db.query(models.room.Room).filter(models.room.Room.id == room_id).first()

def get_rooms(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.room.Room).offset(skip).limit(limit).all()

def update_room(db: Session, room_id: int, updated_data: schemas.room.RoomCreate):
    db_room = db.query(models.room.Room).filter(models.room.Room.id == room_id).first()
    if db_room:
        for key, value in updated_data.model_dump().items():
            setattr(db_room, key, value)
        db.commit()
        db.refresh(db_room)
    return db_room
