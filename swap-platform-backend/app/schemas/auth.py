from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.schemas.product import ProductResponse


class UserRegister(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=6, max_length=100)


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=100)


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    coin_balance: int

    model_config = ConfigDict(from_attributes=True)


class UserProfileResponse(UserResponse):
    products: list[ProductResponse]


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = 'bearer'
