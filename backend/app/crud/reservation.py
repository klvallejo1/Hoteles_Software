from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_
from app import models
from app.schemas import reservation as reservation_schema
from app.crud import room_availability as availability_crud
from app.crud import invoice as invoice_crud
from datetime import date

def create_reservation(db: Session, reservation: reservation_schema.ReservationCreate):
    # Verificar disponibilidad antes de crear
    if not availability_crud.check_room_availability(
        db, reservation.room_id, reservation.start_date, reservation.end_date
    ):
        raise ValueError("La habitación no está disponible en las fechas seleccionadas")
    
    # Obtener la habitación para calcular el monto
    room = db.query(models.Room).filter(models.Room.id == reservation.room_id).first()
    if not room:
        raise ValueError("Habitación no encontrada")
    
    # Calcular el monto total (noches × precio por noche)
    nights = (reservation.end_date - reservation.start_date).days
    if nights <= 0:
        raise ValueError("La fecha de salida debe ser posterior a la fecha de entrada")
    
    # Obtener el precio de la habitación
    room_rate = getattr(room, 'rate', 0.0)
    calculated_total = nights * room_rate
    
    # Crear la reserva con el monto calculado
    reservation_data = reservation.model_dump()
    reservation_data['total_amount'] = calculated_total
    
    db_reservation = models.Reservation(**reservation_data)
    db.add(db_reservation)
    db.commit()
    db.refresh(db_reservation)
    
    # GENERAR PREFACTURA AUTOMÁTICAMENTE PARA CUALQUIER TIPO DE RESERVA
    from app.schemas.invoice import InvoiceCreate
    invoice_data = InvoiceCreate(
        reservation_id=getattr(db_reservation, 'id'),
        amount=calculated_total,
        issue_date=date.today()
    )
    prefactura = invoice_crud.create_invoice(db, invoice_data)
    print(f"Prefactura generada automáticamente: ID {getattr(prefactura, 'id')} por ${calculated_total}")
    
    # Si la reserva se crea como confirmada o activa, bloquear las fechas
    if reservation.status in ["confirmada", "activa"]:
        availability_crud.create_availability_block(
            db, reservation.room_id, reservation.start_date, 
            reservation.end_date, getattr(db_reservation, 'id')
        )
        # Cambiar estado de la habitación a ocupada
        setattr(room, 'status', 'ocupada')
        db.commit()
    
    return db_reservation
    
    return db_reservation

def get_reservation(db: Session, reservation_id):
    return db.query(models.Reservation)\
        .options(joinedload(models.Reservation.client))\
        .options(joinedload(models.Reservation.room))\
        .filter(models.Reservation.id == reservation_id).first()

def get_reservations(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Reservation)\
        .options(joinedload(models.Reservation.client))\
        .options(joinedload(models.Reservation.room))\
        .offset(skip).limit(limit).all()

def update_reservation(db: Session, reservation_id: int, reservation: reservation_schema.ReservationCreate):
    db_reservation = db.query(models.Reservation).filter(models.Reservation.id == reservation_id).first()
    if not db_reservation:
        return None
    
    old_status = db_reservation.status
    
    # Si se cambia a confirmada desde otro estado
    if reservation.status == "confirmada" and old_status != "confirmada":
        # Verificar disponibilidad
        if not availability_crud.check_room_availability(
            db, reservation.room_id, reservation.start_date, reservation.end_date, reservation_id
        ):
            raise ValueError("La habitación no está disponible en las fechas seleccionadas")
        
        # Bloquear fechas
        availability_crud.create_availability_block(
            db, reservation.room_id, reservation.start_date, reservation.end_date, reservation_id
        )
        
        # Cambiar estado de habitación a ocupada
        room = db.query(models.Room).filter(models.Room.id == reservation.room_id).first()
        if room:
            room.status = "ocupada"
    
    # Si se cambia a cancelada desde confirmada
    elif reservation.status == "cancelada" and old_status == "confirmada":
        # Liberar fechas
        availability_crud.release_availability_block(db, reservation_id)
        
        # Cambiar estado de habitación a disponible
        room = db.query(models.Room).filter(models.Room.id == db_reservation.room_id).first()
        if room:
            room.status = "disponible"
    
    # Si se cambia a activa desde confirmada
    elif reservation.status == "activa" and old_status == "confirmada":
        # Generar factura automáticamente
        from app.schemas.invoice import InvoiceCreate
        
        # Calcular el monto basado en las noches y la tarifa de la habitación
        room = db.query(models.Room).filter(models.Room.id == reservation.room_id).first()
        nights = (reservation.end_date - reservation.start_date).days
        total_amount = float(room.rate) * nights
        
        invoice_data = InvoiceCreate(
            reservation_id=reservation_id,
            amount=total_amount,
            issue_date=date.today()
        )
        
        # Crear la factura
        db_invoice = models.Invoice(**invoice_data.model_dump())
        db.add(db_invoice)
    
    # Actualizar los datos de la reserva
    for key, value in reservation.model_dump().items():
        setattr(db_reservation, key, value)
    
    db.commit()
    db.refresh(db_reservation)
    return db_reservation

def delete_reservation(db: Session, reservation_id: int):
    db_reservation = db.query(models.Reservation).filter(models.Reservation.id == reservation_id).first()
    if not db_reservation:
        return False
    
    # Si la reserva estaba confirmada, liberar las fechas
    if db_reservation.status == "confirmada":
        availability_crud.release_availability_block(db, reservation_id)
        
        # Cambiar estado de habitación a disponible
        room = db.query(models.Room).filter(models.Room.id == db_reservation.room_id).first()
        if room:
            room.status = "disponible"
    
    db.delete(db_reservation)
    db.commit()
    return True

def get_active_reservations_by_client(db: Session, client_id: int):
    """Obtener reservas activas de un cliente"""
    return db.query(models.Reservation)\
        .options(joinedload(models.Reservation.client))\
        .options(joinedload(models.Reservation.room))\
        .filter(and_(
            models.Reservation.client_id == client_id,
            models.Reservation.status == "activa"
        )).all()