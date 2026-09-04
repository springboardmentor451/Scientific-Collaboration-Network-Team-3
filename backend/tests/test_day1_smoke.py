from unittest.mock import patch


def test_health_reports_ok(client):
    response = client.get("/health")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert body["redis"] is True


def test_register_login_and_verify_otp(client):
    register = client.post(
        "/auth/register",
        json={
            "username": "day1user",
            "email": "day1@example.com",
            "password": "password123",
        },
    )
    assert register.status_code == 200
    assert register.json()["email"] == "day1@example.com"

    with (
        patch("app.services.otp_service.generate_otp", return_value="123456"),
        patch("app.services.otp_service.send_otp_email") as send_email,
    ):
        login = client.post(
            "/auth/login",
            json={
                "email": "day1@example.com",
                "password": "password123",
            },
        )
        assert login.status_code == 200
        assert login.json()["email"] == "day1@example.com"
        send_email.assert_called_once()

    verify = client.post(
        "/auth/verify-otp",
        json={
            "email": "day1@example.com",
            "otp": "123456",
        },
    )
    assert verify.status_code == 200
    body = verify.json()
    assert body["token_type"] == "bearer"
    assert body["access_token"]
