from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.wishlist_item import WishlistItem
from app.schemas.wishlist import WishlistItemCreate


class WishlistService:
    MAX_ITEMS = 10

    def __init__(self, db: Session):
        self.db = db

    def list_items(self, owner_id: int) -> list[WishlistItem]:
        statement = (
            select(WishlistItem)
            .where(WishlistItem.owner_id == owner_id)
            .order_by(WishlistItem.created_at.desc())
        )
        return list(self.db.scalars(statement).all())

    def count_items(self, owner_id: int) -> int:
        statement = select(func.count(WishlistItem.id)).where(WishlistItem.owner_id == owner_id)
        return self.db.scalar(statement) or 0

    def create_item(self, owner_id: int, payload: WishlistItemCreate) -> WishlistItem:
        item = WishlistItem(owner_id=owner_id, **payload.model_dump())
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def get_item(self, owner_id: int, item_id: int) -> WishlistItem | None:
        statement = select(WishlistItem).where(WishlistItem.id == item_id, WishlistItem.owner_id == owner_id)
        return self.db.scalar(statement)

    def delete_item(self, item: WishlistItem) -> None:
        self.db.delete(item)
        self.db.commit()
