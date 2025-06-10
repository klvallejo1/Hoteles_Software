from sqlalchemy.orm import Session
from app import models, schemas

def create_payment(db: Session, payment: schemas.payment.PaymentCreate):
    db_payment = models.payment.Payment(**payment.model_dump())
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment

def get_payment(db: Session, payment_id):
    return db.query(models.payment.Payment).filter(models.payment.Payment.id == payment_id).first()

def get_payments(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.payment.Payment).offset(skip).limit(limit).all()