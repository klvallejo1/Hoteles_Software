# Hoteles_Software

Este repositorio contiene el código fuente y la documentación de un **Sistema de Gestión de Hoteles**. El objetivo de este software es facilitar la administración de reservas, habitaciones, clientes, personal y servicios del hotel, permitiendo una gestión eficiente y moderna.

## Tecnologías utilizadas

- **Backend:** FastAPI / Python
- **Base de datos:** PostgreSQL
- **Frontend:**  React
  
## Usuarios involucrados

- **klvallejo1:** Kevin Vallejo
- **sonicspeed1:** Bryan Santillán
- **frd2377:** Freddy Viracocha
- **steven20012500:** Josue Suntaxi

## ANTES DE INICIAR
1. Instalar todas las dependencias tanto dentro de la carpeta de backend como frontend
   ```bash
   npm install

## Instalación Backend

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/klvallejo1/Hoteles_Software.git
   cd Hoteles_Software

2. Crear entorno virtual python en raíz /
   ```bash
   py -m venv env

3. Activar entorno Python
   ```bash
   env\Scripts\activate

4. Instalar dependencias
   ```bash
   pip install -r requirements.txt
   
5. Iniciar la base de datos con Alembic
   ```bash
   alembic upgrade head

6. Iniciar backend
   ```bash
   uvicorn app.main:app --reload


## Instalación Frontend

1. Dirigirse a la ruta /frontend y ejecutar
   ```bash
   npm run dev

## Documentación

1. Para acceder a la documentación
   ```bash
   http://localhost:8000/docs#/

2. Realizar las pruebas unitarias
   ```bash
   pytest

3. Analisis de cobertura
    ```bash
   pytest --cov=app --cov-report=html