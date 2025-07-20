from fastapi.testclient import TestClient
from app.main import app

class TestRoomsRoutes:

    rooms = TestClient(app)

    def test_create_rooms(self):
        response = self.rooms.post("/rooms/", json={
            "room_type": "habitacion test",
            "rate": 4,
            "status": "disponible"
        })
        assert response.status_code == 201

    def test_get_rooms(self):
        response = self.rooms.get("/rooms/")
        assert response.status_code == 200
    
    def test_get_rooms_id(self):
        response = self.rooms.get("/rooms/1")
        assert response.status_code == 200

