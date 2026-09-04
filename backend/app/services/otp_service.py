import os
import secrets
import smtplib
from datetime import datetime, timedelta, timezone
from email.message import EmailMessage

from dotenv import load_dotenv
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.models.otp import OTPVerification

load_dotenv()

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
SMTP_FROM_EMAIL = os.getenv("SMTP_FROM_EMAIL", SMTP_USERNAME)
SMTP_FROM_NAME = os.getenv("SMTP_FROM_NAME", "SCNA")

OTP_EXPIRE_MINUTES = int(
    os.getenv("OTP_EXPIRE_MINUTES", "5")
)

OTP_MAX_ATTEMPTS = int(
    os.getenv("OTP_MAX_ATTEMPTS", "5")
)

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def generate_otp() -> str:
    """
    Generate a secure 6-digit OTP.
    """
    return f"{secrets.randbelow(1_000_000):06d}"


def hash_otp(otp: str) -> str:
    """
    Hash OTP before storing it in the database.
    """
    return pwd_context.hash(otp)


def verify_otp_hash(otp: str, otp_hash: str) -> bool:
    """
    Verify entered OTP against stored hash.
    """
    return pwd_context.verify(otp, otp_hash)


def send_otp_email(
    email: str,
    otp: str
) -> None:
    """
    Send OTP to user's email using SMTP.
    """

    if not SMTP_USERNAME or not SMTP_PASSWORD:
        raise RuntimeError(
            "SMTP credentials are not configured in .env"
        )

    message = EmailMessage()

    message["Subject"] = "SCNA - Your OTP Verification Code"
    message["From"] = (
        f"{SMTP_FROM_NAME} <{SMTP_FROM_EMAIL}>"
    )
    message["To"] = email

    message.set_content(
        f"""
Hello,

Your SCNA verification code is:

{otp}

This OTP is valid for {OTP_EXPIRE_MINUTES} minutes.

If you did not try to sign in to SCNA (Scientific Collaboration Network Analyzer), please ignore this email.

Regards,
SCNA Team
"""
    )

    with smtplib.SMTP(
        SMTP_HOST,
        SMTP_PORT
    ) as server:

        server.starttls()

        server.login(
            SMTP_USERNAME,
            SMTP_PASSWORD
        )

        server.send_message(message)


def create_and_send_otp(
    db: Session,
    email: str
) -> None:
    """
    Generate OTP, store its hash and send it by email.
    """

    # Invalidate previous unused OTPs
    old_otps = (
        db.query(OTPVerification)
        .filter(
            OTPVerification.email == email,
            OTPVerification.is_verified == False
        )
        .all()
    )

    for old_otp in old_otps:
        old_otp.is_verified = True

    # Generate new OTP
    otp = generate_otp()

    otp_hash = hash_otp(otp)

    expires_at = datetime.now(timezone.utc) + timedelta(
        minutes=OTP_EXPIRE_MINUTES
    )

    otp_record = OTPVerification(
        email=email,
        otp_hash=otp_hash,
        expires_at=expires_at,
        is_verified=False,
        attempts=0,
        created_at=datetime.now(timezone.utc)
    )

    db.add(otp_record)
    db.commit()

    try:
        send_otp_email(
            email=email,
            otp=otp
        )

    except Exception:
        db.delete(otp_record)
        db.commit()
        raise


def verify_otp(
    db: Session,
    email: str,
    otp: str
) -> bool:

    otp_record = (
        db.query(OTPVerification)
        .filter(
            OTPVerification.email == email,
            OTPVerification.is_verified == False
        )
        .order_by(
            OTPVerification.created_at.desc()
        )
        .first()
    )

    if not otp_record:
        return False

    # Check expiry
    if datetime.now(timezone.utc) > otp_record.expires_at:
        return False

    # Check maximum attempts
    if otp_record.attempts >= OTP_MAX_ATTEMPTS:
        return False

    otp_record.attempts += 1

    is_valid = verify_otp_hash(
        otp,
        otp_record.otp_hash
    )

    if not is_valid:
        db.commit()
        return False

    otp_record.is_verified = True

    db.commit()

    return True