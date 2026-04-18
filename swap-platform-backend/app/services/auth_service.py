from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import create_access_token, get_password_hash, verify_password
from app.models.user import User
from app.schemas.auth import UserLogin, UserRegister


class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def register(self, payload: UserRegister) -> User:
        existing_user = self.db.scalar(select(User).where(User.email == payload.email))
        if existing_user:
            raise ValueError('This email is already registered.')

        user = User(
            name=payload.name,
            email=payload.email,
            hashed_password=get_password_hash(payload.password),
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def login(self, payload: UserLogin) -> str:
        user = self.db.scalar(select(User).where(User.email == payload.email))
        if not user or not verify_password(payload.password, user.hashed_password):
            raise ValueError('Invalid email or password.')
        return create_access_token(user.id)
