from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app.database import SessionLocal
from app.schemas import invoice as invoice_schema
from app.crud import invoice as invoice_crud
from app import models

router = APIRouter(prefix="/invoices", tags=["invoices"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=invoice_schema.InvoiceOut, status_code=201)
def create_invoice(invoice: invoice_schema.InvoiceCreate, db: Session = Depends(get_db)):
    return invoice_crud.create_invoice(db, invoice)

@router.get("/", response_model=list[invoice_schema.InvoiceOut])
def list_invoices(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return invoice_crud.get_invoices(db, skip, limit)

@router.get("/by-client/{client_id}", response_model=list[invoice_schema.InvoiceOut])
def get_invoices_by_client(client_id: int, db: Session = Depends(get_db)):
    """Obtener todas las facturas de un cliente específico"""
    invoices = db.query(models.Invoice)\
        .options(joinedload(models.Invoice.reservation).joinedload(models.Reservation.client))\
        .options(joinedload(models.Invoice.reservation).joinedload(models.Reservation.room))\
        .join(models.Reservation)\
        .filter(models.Reservation.client_id == client_id)\
        .all()
    return invoices

@router.get("/pending-by-client/{client_id}")
def get_pending_invoices_by_client(client_id: int, db: Session = Depends(get_db)):
    """Obtener facturas pendientes de pago de un cliente específico"""
    invoices = db.query(models.Invoice)\
        .options(joinedload(models.Invoice.reservation).joinedload(models.Reservation.client))\
        .options(joinedload(models.Invoice.reservation).joinedload(models.Reservation.room))\
        .join(models.Reservation)\
        .filter(models.Reservation.client_id == client_id)\
        .all()
    
    # Filtrar facturas que no están completamente pagadas
    pending_invoices = []
    for invoice in invoices:
        total_payments = db.query(models.Payment)\
            .filter(models.Payment.invoice_id == invoice.id)\
            .all()
        
        total_paid = sum(getattr(payment, 'amount', 0) for payment in total_payments)
        invoice_amount = getattr(invoice, 'amount', 0)
        
        if total_paid < invoice_amount:
            # Agregar información de pagos
            invoice_data = {
                "id": getattr(invoice, 'id'),
                "reservation_id": getattr(invoice, 'reservation_id'),
                "amount": invoice_amount,
                "issue_date": getattr(invoice, 'issue_date'),
                "total_paid": total_paid,
                "pending_amount": invoice_amount - total_paid,
                "reservation": {
                    "id": getattr(invoice.reservation, 'id', None),
                    "start_date": getattr(invoice.reservation, 'start_date', None),
                    "end_date": getattr(invoice.reservation, 'end_date', None),
                    "status": getattr(invoice.reservation, 'status', None),
                    "total_amount": getattr(invoice.reservation, 'total_amount', None),
                    "client": {
                        "id": getattr(invoice.reservation.client, 'id', None),
                        "name": getattr(invoice.reservation.client, 'name', None),
                        "email": getattr(invoice.reservation.client, 'email', None),
                    } if invoice.reservation and invoice.reservation.client else None,
                    "room": {
                        "id": getattr(invoice.reservation.room, 'id', None),
                        "room_type": getattr(invoice.reservation.room, 'room_type', None),
                        "rate": getattr(invoice.reservation.room, 'rate', None),
                    } if invoice.reservation and invoice.reservation.room else None
                } if invoice.reservation else None
            }
            pending_invoices.append(invoice_data)
    
    return pending_invoices

@router.get("/{invoice_id}", response_model=invoice_schema.InvoiceOut)
def get_invoice(invoice_id: int, db: Session = Depends(get_db)):
    invoice = invoice_crud.get_invoice(db, invoice_id)
    if not invoice:
        raise HTTPException(status_code=404, detail="Factura no encontrada")
    return invoice
