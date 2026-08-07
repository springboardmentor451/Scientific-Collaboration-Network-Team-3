from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User

from app.schemas.auth import (
    UserRegister,
    UserLogin,
    UserResponse,
    Token
)

from app.security import (
    hash_password,
    verify_password,
    create_access_token
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# -----------------------------
# Register
# -----------------------------
@router.post("/register", response_model=UserResponse)
def register(user: UserRegister, db: Session = Depends(get_db)):
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
            hashed_password=hash_password(user.password)
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
# Login
# -----------------------------
@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):

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