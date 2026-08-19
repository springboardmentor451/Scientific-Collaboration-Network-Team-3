from sqlalchemy import Column, Integer, String, DateTime, Boolean
from app.database import Base


class OTPVerification(Base):
    __tablename__ = "otp_verifications"

    id = Column(Integer, primary_key=True, index=True)

    email = Column(String(255), nullable=False, index=True)

    otp_hash = Column(String(255), nullable=False)

    expires_at = Column(DateTime, nullable=False)

    is_verified = Column(Boolean, default=False, nullable=False)

    attempts = Column(Integer, default=0, nullable=False)

    created_at = Column(
        DateTime,
        nullable=False
    )