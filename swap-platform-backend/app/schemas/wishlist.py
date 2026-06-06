from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class WishlistItemCreate(BaseModel):
    item_name: str = Field(min_length=1, max_length=150)
    desired_point_price: int = Field(ge=0)


class WishlistItemResponse(BaseModel):
    id: int
    item_name: str
    desired_point_price: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
