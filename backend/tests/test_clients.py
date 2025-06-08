import unittest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

class TestClientRoutes(unittest.TestCase):

    def test_create_client(self):
        response = client.post("/clients/", json={
            "name": "Danna Perez",
            "email": "dannap@example.com",
            "phone": "0984875252"
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn("id", response.json())

    def test_get_clients(self):
        response = client.get("/clients/")
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)

if __name__ == '__main__':
    unittest.main()
