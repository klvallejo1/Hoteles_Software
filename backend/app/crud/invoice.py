from sqlalchemy.orm import Session
from app import models
from app.schemas import invoice as invoice_schema
from app.models import Client,Reservation,Invoice,Payment
from app.schemas.client import ClientOut
from app.schemas.invoice import InvoiceOut

def create_invoice(db: Session, invoice: invoice_schema.InvoiceCreate):
    db_invoice = models.Invoice(**invoice.model_dump())
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)
    return db_invoice

def get_invoice(db: Session, invoice_id):
    return db.query(models.Invoice).filter(models.Invoice.id == invoice_id).first()

def get_invoices(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Invoice).offset(skip).limit(limit).all()

#invoices and clients
def get_invoices_clients(db: Session):
    query = db.query(Client, Reservation, Invoice, Payment)\
    .select_from(Invoice)\
    .outerjoin(Reservation, Reservation.id == Invoice.reservation_id)\
    .outerjoin(Client, Client.id == Reservation.client_id)\
    .outerjoin(Payment, Payment.invoice_id == Invoice.id)\
    .all()
    print(len(query))
    response_data = []

    for client, reservation, invoice, payment in query:
        item = {
            "client": ClientOut.model_validate(client) if client else None,
            "invoice": InvoiceOut.model_validate(invoice) if invoice else None,
        }
        response_data.append(item)
    return response_data