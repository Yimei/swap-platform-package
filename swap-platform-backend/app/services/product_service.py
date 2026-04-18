from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.product import Product
from app.schemas.product import ProductCreate


class ProductService:
    def __init__(self, db: Session):
        self.db = db

    def list_active_products(self) -> list[Product]:
        statement = select(Product).where(Product.is_active.is_(True)).order_by(Product.created_at.desc())
        return list(self.db.scalars(statement).all())

    def create_product(self, owner_id: int, payload: ProductCreate) -> Product:
        product = Product(owner_id=owner_id, **payload.model_dump())
        self.db.add(product)
        self.db.commit()
        self.db.refresh(product)
        return product
