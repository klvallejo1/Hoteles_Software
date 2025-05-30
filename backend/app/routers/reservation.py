from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas import reservation as reservation_schema
from app.crud import reservation as reservation_crud

router = APIRouter(prefix="/reservations", tags=["reservations"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=reservation_schema.ReservationOut)
def create_reservation(reservation: reservation_schema.ReservationCreate, db: Session = Depends(get_db)):
    return reservation_crud.create_reservation(db, reservation)

@router.get("/", response_model=list[reservation_schema.ReservationOut])
def list_reservations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return reservation_crud.get_reservations(db, skip, limit)

@router.get("/{reservation_id}", response_model=reservation_schema.ReservationOut)
def get_reservation(reservation_id: str, db: Session = Depends(get_db)):
    return reservation_crud.get_reservation(db, reservation_id)
