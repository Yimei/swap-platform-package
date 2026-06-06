from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.wishlist import WishlistItemCreate, WishlistItemResponse
from app.services.wishlist_service import WishlistService

router = APIRouter(prefix='/wishlist', tags=['wishlist'])


@router.get('', response_model=list[WishlistItemResponse])
def list_wishlist_items(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = WishlistService(db)
    return service.list_items(current_user.id)


@router.post('', response_model=WishlistItemResponse, status_code=status.HTTP_201_CREATED)
def create_wishlist_item(
    payload: WishlistItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = WishlistService(db)
    if service.count_items(current_user.id) >= service.MAX_ITEMS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='Wishlist can contain up to 10 items.',
        )
    return service.create_item(owner_id=current_user.id, payload=payload)


@router.delete('/{item_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_wishlist_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = WishlistService(db)
    item = service.get_item(owner_id=current_user.id, item_id=item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Wishlist item not found.')
    service.delete_item(item)
