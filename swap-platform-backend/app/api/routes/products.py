from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.product import ProductCreate, ProductResponse, ProductUpdate
from app.services.product_service import ProductService

router = APIRouter(prefix='/products', tags=['products'])


@router.get('', response_model=list[ProductResponse])
def list_products(db: Session = Depends(get_db)):
    service = ProductService(db)
    return service.list_active_products()


@router.get('/{product_id}', response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    service = ProductService(db)
    product = service.get_active_product(product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Product not found.')
    return product


@router.post('', response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = ProductService(db)
    return service.create_product(owner_id=current_user.id, payload=payload)


@router.put('/{product_id}', response_model=ProductResponse)
def update_product(
    product_id: int,
    payload: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = ProductService(db)
    product = service.get_active_product(product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Product not found.')
    if product.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='You can only edit your own products.')
    return service.update_product(product=product, payload=payload)
