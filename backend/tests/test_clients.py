from fastapi.testclient import TestClient
from app.main import app
from uuid import uuid4

class TestClientRoutes:

    client = TestClient(app)

    def test_create_client(self):
        response = self.client.post("/clients/", json={
            "name": "Danna Perez",
            "email": f"ejemplo{uuid4()}@example.com",
            "phone": "0984875252"
        })
        assert response.status_code == 201

    def test_get_clients(self):
        response = self.client.get("/clients/")
        assert response.status_code == 200
    
    def test_get_clients_id(self):
        response = self.client.get("/clients/1")
        assert response.status_code == 200

