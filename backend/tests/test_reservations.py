from fastapi.testclient import TestClient
from app.main import app

class TestReservationsRoutes:

    reservations = TestClient(app)

    def test_create_reservations(self):
        response = self.reservations.post("/reservations/", json={
            "client_id": 1,
            "room_id": 1,
            "start_date": "2025-06-09",
            "end_date": "2025-06-09",
            "status": "pendiente"
        })
        assert response.status_code == 201

    def test_get_reservations(self):
        response = self.reservations.get("/reservations/")
        assert response.status_code == 200
    
    def test_get_reservations_id(self):
        response = self.reservations.get("/reservations/1")
        assert response.status_code == 200

