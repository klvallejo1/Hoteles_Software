from sqlalchemy.orm import Session
from app import models, schemas

def create_client(db: Session, client: schemas.client.ClientCreate):
    db_client = models.Client(**client.model_dump())
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

def get_client(db: Session, client_id):
    return db.query(models.client.Client).filter(models.client.Client.id == client_id).first()

def get_clients(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.client.Client).offset(skip).limit(limit).all()