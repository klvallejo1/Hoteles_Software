from fastapi.testclient import TestClient
from app.main import app
from random import randint

class TestPaymentsRoutes:

    payments = TestClient(app)

    def test_create_payments(self):
        response = self.payments.post("/payments/", json={
            "invoice_id": 1,
            "method": "string",
            "payment_date": "2025-06-09",
            "amount": randint(5,100)
        })
        assert response.status_code == 201

    def test_get_payments(self):
        response = self.payments.get("/payments/")
        assert response.status_code == 200
    
    def test_get_payments_id(self):
        response = self.payments.get("/payments/1")
        assert response.status_code == 200

