from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User

from app.schemas.auth import (
    UserRegister,
    UserLogin,
    UserResponse,
    Token,
    OTPVerify,
    OTPResponse
)

from app.security import (
    hash_password,
    verify_password,
    create_access_token
)

from app.services.otp_service import (
    create_and_send_otp,
    verify_otp
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# -----------------------------
# Register
# -----------------------------
@router.post(
    "/register",
    response_model=UserResponse
)
def register(
    user: UserRegister,
    db: Session = Depends(get_db)
):

    try:

        # Check Email
        existing_email = (
            db.query(User)
            .filter(User.email == user.email)
            .first()
        )

        if existing_email:
            raise HTTPException(
                status_code=400,
                detail="Email already exists"
            )

        # Check Username
        existing_username = (
            db.query(User)
            .filter(User.username == user.username)
            .first()
        )

        if existing_username:
            raise HTTPException(
                status_code=400,
                detail="Username already exists"
            )

        # Create User
        new_user = User(
            username=user.username,
            email=user.email,
            hashed_password=hash_password(
                user.password
            )
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return new_user

    except HTTPException:
        raise

    except Exception as e:
        print("REGISTER ERROR:", e)

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# -----------------------------
# Login - Send OTP
# -----------------------------
@router.post(
    "/login",
    response_model=OTPResponse
)
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    db_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        user.password,
        db_user.hashed_password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not db_user.is_active:
        raise HTTPException(
            status_code=403,
            detail="User account is inactive"
        )

    try:

        create_and_send_otp(
            db=db,
            email=db_user.email
        )

    except Exception as e:

        print("OTP EMAIL ERROR:", e)

        raise HTTPException(
            status_code=500,
            detail="Unable to send OTP email"
        )

    return {
        "message": "OTP sent successfully to your email",
        "email": db_user.email
    }


# -----------------------------
# Verify OTP
# -----------------------------
@router.post(
    "/verify-otp",
    response_model=Token
)
def verify_otp_endpoint(
    data: OTPVerify,
    db: Session = Depends(get_db)
):

    db_user = (
        db.query(User)
        .filter(User.email == data.email)
        .first()
    )

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email"
        )

    is_valid = verify_otp(
        db=db,
        email=data.email,
        otp=data.otp
    )

    if not is_valid:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired OTP"
        )

    access_token = create_access_token(
        {
            "sub": db_user.email,
            "id": db_user.id
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }