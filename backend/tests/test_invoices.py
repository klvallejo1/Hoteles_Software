from fastapi.testclient import TestClient
from app.main import app
from random import randint

class TestInvoicesRoutes:

    invoices = TestClient(app)

    def test_create_invoices(self):
        response = self.invoices.post("/invoices/", json={
            "reservation_id": 1,
            "amount": randint(5,100),
            "issue_date": "2025-06-09"
        })
        assert response.status_code == 201

    def test_get_invoices(self):
        response = self.invoices.get("/invoices/")
        assert response.status_code == 200
    
    def test_get_invoices_id(self):
        response = self.invoices.get("/invoices/1")
        assert response.status_code == 200

