from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


class ProductCreate(BaseModel):
    title: str = Field(min_length=1, max_length=150)
    description: str = Field(min_length=1)
    category: str = Field(min_length=1, max_length=80)
    point_price: int = Field(ge=0)
    condition: str = Field(min_length=1, max_length=60)
    city: str = Field(min_length=1, max_length=80)
    image_url: str | None = Field(default=None, max_length=500)
    image_urls: list[str] = Field(default_factory=list, max_length=6)

    @field_validator('image_urls')
    @classmethod
    def clean_image_urls(cls, value: list[str]) -> list[str]:
        cleaned = [url.strip() for url in value if url.strip()]
        if len(cleaned) > 6:
            raise ValueError('A product can have at most 6 images.')
        for url in cleaned:
            if len(url) > 500:
                raise ValueError('Each image URL must be 500 characters or fewer.')
        return cleaned


class ProductUpdate(ProductCreate):
    pass


class ProductResponse(BaseModel):
    id: int
    title: str
    description: str
    category: str
    point_price: int
    condition: str
    city: str
    image_url: str | None
    image_urls: list[str]
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

    @model_validator(mode='before')
    @classmethod
    def fill_image_urls(cls, value):
        image_urls = getattr(value, 'image_urls', None)
        image_url = getattr(value, 'image_url', None)
        if image_urls is None:
            setattr(value, 'image_urls', [image_url] if image_url else [])
        return value
