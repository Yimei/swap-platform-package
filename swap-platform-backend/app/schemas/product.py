from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ProductCreate(BaseModel):
    title: str = Field(min_length=1, max_length=150)
    description: str = Field(min_length=1)
    category: str = Field(min_length=1, max_length=80)
    point_price: int = Field(ge=0)
    condition: str = Field(min_length=1, max_length=60)
    city: str = Field(min_length=1, max_length=80)
    image_url: str | None = Field(default=None, max_length=500)


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
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
