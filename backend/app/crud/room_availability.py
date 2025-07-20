from sqlalchemy.orm import Session
from sqlalchemy import and_
from app import models
from datetime import date, timedelta

def create_availability_block(db: Session, room_id: int, start_date: date, end_date: date, reservation_id: int):
    """Bloquear fechas para una reserva"""
    current_date = start_date
    while current_date <= end_date:
        # Verificar si ya existe un registro para esta fecha
        existing = db.query(models.RoomAvailability).filter(
            and_(
                models.RoomAvailability.room_id == room_id,
                models.RoomAvailability.date == current_date
            )
        ).first()
        
        if existing:
            # Actualizar el registro existente
            existing.is_available = False
            existing.reservation_id = reservation_id
        else:
            # Crear nuevo registro
            availability = models.RoomAvailability(
                room_id=room_id,
                date=current_date,
                is_available=False,
                reservation_id=reservation_id
            )
            db.add(availability)
        
        current_date += timedelta(days=1)
    
    db.commit()

def release_availability_block(db: Session, reservation_id: int):
    """Liberar fechas cuando se cancela una reserva"""
    availability_records = db.query(models.RoomAvailability).filter(
        models.RoomAvailability.reservation_id == reservation_id
    ).all()
    
    for record in availability_records:
        record.is_available = True
        record.reservation_id = None
    
    db.commit()

def check_room_availability(db: Session, room_id: int, start_date: date, end_date: date, exclude_reservation_id: int = None):
    """Verificar si una habitación está disponible en un rango de fechas"""
    current_date = start_date
    while current_date <= end_date:
        # Buscar si hay alguna reserva activa para esta fecha
        query = db.query(models.RoomAvailability).filter(
            and_(
                models.RoomAvailability.room_id == room_id,
                models.RoomAvailability.date == current_date,
                models.RoomAvailability.is_available == False
            )
        )
        
        # Excluir la reserva actual si estamos editando
        if exclude_reservation_id:
            query = query.filter(models.RoomAvailability.reservation_id != exclude_reservation_id)
        
        if query.first():
            return False
        
        current_date += timedelta(days=1)
    
    return True

def get_unavailable_dates(db: Session, room_id: int):
    """Obtener todas las fechas no disponibles para una habitación"""
    unavailable = db.query(models.RoomAvailability).filter(
        and_(
            models.RoomAvailability.room_id == room_id,
            models.RoomAvailability.is_available == False
        )
    ).all()
    
    return [record.date for record in unavailable]
