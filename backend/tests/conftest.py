import os
from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import sessionmaker


os.environ["DATABASE_URL"] = "sqlite:///./test_scna.db"
os.environ["SECRET_KEY"] = "day1-test-secret"
os.environ["ALGORITHM"] = "HS256"
os.environ["REDIS_URL"] = "redis://localhost:6379/0"
os.environ["SMTP_USERNAME"] = "test"
os.environ["SMTP_PASSWORD"] = "test"

from app.database import Base, engine, get_db  # noqa: E402
from app.models.citation import Citation  # noqa: E402, F401
from app.models.collaboration import Collaboration  # noqa: E402, F401
from app.models.conditional_rule import ConditionalRule  # noqa: E402, F401
from app.models.conference import Conference  # noqa: E402, F401
from app.models.form import Form  # noqa: E402, F401
from app.models.institution import Institution  # noqa: E402, F401
from app.models.otp import OTPVerification  # noqa: E402, F401
from app.models.publication import Publication  # noqa: E402, F401
from app.models.publication_author import PublicationAuthor  # noqa: E402, F401
from app.models.researcher import Researcher  # noqa: E402, F401
from app.models.response import Response  # noqa: E402, F401
from app.models.user import User  # noqa: E402, F401

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture
def db_session():
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    redis_mock = MagicMock()
    redis_mock.ping.return_value = True

    with (
        patch("app.main.get_redis", return_value=redis_mock),
        patch("app.core.redis_client.get_redis", return_value=redis_mock),
    ):
        from app.main import app

        app.dependency_overrides[get_db] = override_get_db
        with TestClient(app) as test_client:
            yield test_client
        app.dependency_overrides.clear()


def _register_and_login(client, username, email, password, role="Researcher"):
    """Helper: register a user, mock OTP, verify, return Bearer headers."""
    client.post(
        "/auth/register",
        json={
            "username": username,
            "email": email,
            "password": password,
            "role": role,
        },
    )

    with (
        patch("app.services.otp_service.generate_otp", return_value="123456"),
        patch("app.services.otp_service.send_otp_email"),
    ):
        client.post(
            "/auth/login",
            json={"email": email, "password": password},
        )

    verify = client.post(
        "/auth/verify-otp",
        json={"email": email, "otp": "123456"},
    )
    token = verify.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def auth_headers(client):
    """Default Researcher auth headers."""
    return _register_and_login(
        client,
        "testresearcher",
        "researcher@test.com",
        "password123",
        "Researcher",
    )


@pytest.fixture
def admin_headers(client):
    """System Admin auth headers."""
    return _register_and_login(
        client,
        "testadmin",
        "admin@test.com",
        "password123",
        "System Admin",
    )


@pytest.fixture
def inst_admin_headers(client):
    """Institution Admin auth headers."""
    return _register_and_login(
        client,
        "testinstadmin",
        "instadmin@test.com",
        "password123",
        "Institution Admin",
    )


@pytest.fixture
def reviewer_headers(client):
    """Reviewer auth headers."""
    return _register_and_login(
        client,
        "testreviewer",
        "reviewer@test.com",
        "password123",
        "Reviewer",
    )
