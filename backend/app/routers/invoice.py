from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas import invoice as invoice_schema
from app.crud import invoice as invoice_crud

router = APIRouter(prefix="/invoices", tags=["invoices"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=invoice_schema.InvoiceOut)
def create_invoice(invoice: invoice_schema.InvoiceCreate, db: Session = Depends(get_db)):
    return invoice_crud.create_invoice(db, invoice)

@router.get("/", response_model=list[invoice_schema.InvoiceOut])
def list_invoices(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return invoice_crud.get_invoices(db, skip, limit)

@router.get("/{invoice_id}", response_model=invoice_schema.InvoiceOut)
def get_invoice(invoice_id: str, db: Session = Depends(get_db)):
    return invoice_crud.get_invoice(db, invoice_id)
