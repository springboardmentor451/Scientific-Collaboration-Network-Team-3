from sqlalchemy import Boolean, Column, Integer, String

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), nullable=False, unique=True)
    email = Column(String(255), nullable=False, unique=True)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, nullable=True, default=True)
    role = Column(
        String(50),
        nullable=False,
        default="Researcher",
        server_default="Researcher",
    )
