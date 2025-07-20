from fastapi import APIRouter, Depends, HTTPException
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

@router.post("/", response_model=reservation_schema.ReservationOut, status_code=201)
def create_reservation(reservation: reservation_schema.ReservationCreate, db: Session = Depends(get_db)):
    try:
        return reservation_crud.create_reservation(db, reservation)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=list[reservation_schema.ReservationOut])
def list_reservations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return reservation_crud.get_reservations(db, skip, limit)

@router.get("/active-by-client/{client_id}", response_model=list[reservation_schema.ReservationOut])
def get_active_reservations_by_client(client_id: int, db: Session = Depends(get_db)):
    """Obtener reservas activas de un cliente específico"""
    return reservation_crud.get_active_reservations_by_client(db, client_id)

@router.get("/{reservation_id}", response_model=reservation_schema.ReservationOut)
def get_reservation(reservation_id: int, db: Session = Depends(get_db)):
    reservation = reservation_crud.get_reservation(db, reservation_id)
    if not reservation:
        raise HTTPException(status_code=404, detail="Reserva no encontrada")
    return reservation

@router.put("/{reservation_id}", response_model=reservation_schema.ReservationOut)
def update_reservation(reservation_id: int, reservation: reservation_schema.ReservationCreate, db: Session = Depends(get_db)):
    try:
        updated_reservation = reservation_crud.update_reservation(db, reservation_id, reservation)
        if not updated_reservation:
            raise HTTPException(status_code=404, detail="Reserva no encontrada")
        return updated_reservation
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{reservation_id}")
def delete_reservation(reservation_id: int, db: Session = Depends(get_db)):
    if not reservation_crud.delete_reservation(db, reservation_id):
        raise HTTPException(status_code=404, detail="Reserva no encontrada")
    return {"message": "Reserva eliminada exitosamente"}
