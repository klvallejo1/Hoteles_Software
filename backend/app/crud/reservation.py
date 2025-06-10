from sqlalchemy.orm import Session
from app import models, schemas

def create_reservation(db: Session, reservation: schemas.reservation.ReservationCreate):
    db_reservation = models.reservation.Reservation(**reservation.model_dump())
    db.add(db_reservation)
    db.commit()
    db.refresh(db_reservation)
    return db_reservation

def get_reservation(db: Session, reservation_id):
    return db.query(models.reservation.Reservation).filter(models.reservation.Reservation.id == reservation_id).first()

def get_reservations(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.reservation.Reservation).offset(skip).limit(limit).all()