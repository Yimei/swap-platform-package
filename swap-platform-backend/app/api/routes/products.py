from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.product import ProductCreate, ProductResponse
from app.services.product_service import ProductService

router = APIRouter(prefix='/products', tags=['products'])


@router.get('', response_model=list[ProductResponse])
def list_products(db: Session = Depends(get_db)):
    service = ProductService(db)
    return service.list_active_products()


@router.post('', response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = ProductService(db)
    return service.create_product(owner_id=current_user.id, payload=payload)
