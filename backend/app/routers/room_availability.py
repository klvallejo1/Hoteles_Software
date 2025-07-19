from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.crud import room_availability as availability_crud
from datetime import date
from typing import List

router = APIRouter(prefix="/room-availability", tags=["room-availability"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/{room_id}/unavailable-dates", response_model=List[date])
def get_unavailable_dates(room_id: int, db: Session = Depends(get_db)):
    """Obtener fechas no disponibles para una habitación"""
    return availability_crud.get_unavailable_dates(db, room_id)

@router.get("/{room_id}/check-availability")
def check_availability(
    room_id: int, 
    start_date: date, 
    end_date: date, 
    exclude_reservation_id: int = None,
    db: Session = Depends(get_db)
):
    """Verificar si una habitación está disponible en un rango de fechas"""
    is_available = availability_crud.check_room_availability(
        db, room_id, start_date, end_date, exclude_reservation_id
    )
    return {"available": is_available}
