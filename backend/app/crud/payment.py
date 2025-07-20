from sqlalchemy.orm import Session, joinedload
from app import models
from app.schemas import payment as payment_schema
from app.crud import room_availability as availability_crud
from app.models import Client,Reservation,Invoice,Payment
from app.schemas.client import ClientOut
from app.schemas.invoice import InvoiceOut
from app.schemas.payment import PaymentOut

def create_payment(db: Session, payment: payment_schema.PaymentCreate):
    db_payment = models.Payment(**payment.model_dump())
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    
    # Obtener la factura y la reserva asociada
    invoice = db.query(models.Invoice)\
        .options(joinedload(models.Invoice.reservation))\
        .filter(models.Invoice.id == payment.invoice_id).first()
    
    if invoice and invoice.reservation:
        reservation = invoice.reservation
        
        # Verificar si el pago cubre el total de la factura
        total_payments = db.query(models.Payment)\
            .filter(models.Payment.invoice_id == payment.invoice_id)\
            .all()
        
        total_paid = sum(p.amount for p in total_payments)
        
        # Si se ha pagado el total o más, completar la reserva
        if total_paid >= invoice.amount:
            # Cambiar estado de la reserva a completada
            reservation.status = "completada"
            
            # Liberar las fechas de la habitación
            availability_crud.release_availability_block(db, reservation.id)
            
            # Cambiar estado de la habitación a disponible
            room = db.query(models.Room).filter(models.Room.id == reservation.room_id).first()
            if room:
                room.status = "disponible"
            
            db.commit()
    
    return db_payment

def get_payment(db: Session, payment_id):
    return db.query(models.Payment)\
        .options(joinedload(models.Payment.invoice))\
        .filter(models.Payment.id == payment_id).first()

def get_payments(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Payment)\
        .options(joinedload(models.Payment.invoice))\
        .offset(skip).limit(limit).all()

def update_payment(db: Session, payment_id: int, payment: payment_schema.PaymentCreate):
    db_payment = db.query(models.Payment).filter(models.Payment.id == payment_id).first()
    if db_payment:
        for key, value in payment.model_dump().items():
            setattr(db_payment, key, value)
        db.commit()
        db.refresh(db_payment)
    return db_payment

def delete_payment(db: Session, payment_id: int):
    db_payment = db.query(models.Payment).filter(models.Payment.id == payment_id).first()
    if db_payment:
        db.delete(db_payment)
        db.commit()
        return True
    return False

#payments and clients
def get_payments_clients(db: Session):
    query = db.query(Client,Reservation,Invoice,Payment)\
    .join(Reservation, Client.id == Reservation.client_id)\
    .join(Invoice, Reservation.id == Invoice.reservation_id, isouter=False)\
    .outerjoin(Payment, Invoice.id == Payment.invoice_id)\
    .all()
    response_data = []

    for client, reservation, invoice, payment in query:
        item = {
            "client": ClientOut.model_validate(client) if client else None,
            "invoice": InvoiceOut.model_validate(invoice) if invoice else None,
            "payment": PaymentOut.model_validate(payment) if payment else None,
        }
        response_data.append(item)

    return response_data