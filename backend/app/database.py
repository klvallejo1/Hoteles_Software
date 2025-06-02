from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Cargar .env
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Validar
if DATABASE_URL is None:
    raise ValueError("❌ ERROR: No se pudo cargar DATABASE_URL desde el archivo .env")

# Conexión para PostgreSQL
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()