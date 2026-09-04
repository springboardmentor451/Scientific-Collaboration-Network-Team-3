from typing import Any, Dict, Optional

from pydantic import BaseModel, ConfigDict, EmailStr


class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class OTPVerify(BaseModel):
    email: EmailStr
    otp: str


class ResendOTPRequest(BaseModel):
    email: EmailStr


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    email: EmailStr
    role: str = "Researcher"
    is_active: bool = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenWithUser(BaseModel):
    """Returned after OTP verification — includes JWT and resolved user object."""
    access_token: str
    token_type: str
    user: Dict[str, Any]


class OTPResponse(BaseModel):
    message: str
    email: EmailStr