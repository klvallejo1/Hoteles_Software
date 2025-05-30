from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas import payment as payment_schema
from app.crud import payment as payment_crud

router = APIRouter(prefix="/payments", tags=["payments"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=payment_schema.PaymentOut)
def create_payment(payment: payment_schema.PaymentCreate, db: Session = Depends(get_db)):
    return payment_crud.create_payment(db, payment)

@router.get("/", response_model=list[payment_schema.PaymentOut])
def list_payments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return payment_crud.get_payments(db, skip, limit)

@router.get("/{payment_id}", response_model=payment_schema.PaymentOut)
def get_payment(payment_id: str, db: Session = Depends(get_db)):
    return payment_crud.get_payment(db, payment_id)
