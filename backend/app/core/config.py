from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    DATABASE_URL: str = "postgresql://user:password@localhost:5432/scn_analyzer"
    REDIS_URL: str = "redis://localhost:6379/0"
    SECRET_KEY: str = "change-me"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    JWT_SECRET_KEY: str = "change-me"
    JWT_ALGORITHM: str = "HS256"
    SMTP_HOST: str = "localhost"
    SMTP_PORT: int = 1025
    SMTP_USERNAME: str | None = None
    SMTP_PASSWORD: str | None = None
    SMTP_FROM_EMAIL: str | None = None
    SMTP_FROM_NAME: str = "SCNA"
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
