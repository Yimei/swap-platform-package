from fastapi import APIRouter

from app.api.routes import auth, products, wishlist

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(products.router)
api_router.include_router(wishlist.router)
