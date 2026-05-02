from functools import lru_cache
import json

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8', case_sensitive=False)

    app_name: str = 'Swap Platform API'
    environment: str = 'development'
    api_v1_prefix: str = '/api/v1'
    secret_key: str = 'change-this-to-a-long-random-secret'
    access_token_expire_minutes: int = 60 * 24 * 7
    database_url: str = 'postgresql+psycopg2://postgres:postgres@localhost:5432/swap_platform'
    cors_origins_raw: str = Field(
        default='http://localhost:3000,http://127.0.0.1:3000',
        validation_alias='CORS_ORIGINS',
    )

    @property
    def cors_origins(self) -> list[str]:
        value = self.cors_origins_raw.strip()
        if not value:
            return []

        if value.startswith('['):
            parsed = json.loads(value)
            if not isinstance(parsed, list):
                raise ValueError('CORS_ORIGINS JSON value must be a list.')
            return [str(origin).strip() for origin in parsed if str(origin).strip()]

        return [origin.strip() for origin in value.split(',') if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
