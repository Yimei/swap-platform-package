from functools import lru_cache
from typing import List

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8', case_sensitive=False)

    app_name: str = 'Swap Platform API'
    environment: str = 'development'
    api_v1_prefix: str = '/api/v1'
    secret_key: str = 'change-this-to-a-long-random-secret'
    access_token_expire_minutes: int = 60 * 24 * 7
    database_url: str = 'postgresql+psycopg2://postgres:postgres@localhost:5432/swap_platform'
    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    @field_validator('cors_origins', mode='before')
    @classmethod
    def parse_cors_origins(cls, value: List[str] | str):
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(',') if origin.strip()]
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()
