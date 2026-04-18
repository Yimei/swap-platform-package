from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate


class ProductService:
    def __init__(self, db: Session):
        self.db = db

    def list_active_products(self) -> list[Product]:
        statement = select(Product).where(Product.is_active.is_(True)).order_by(Product.created_at.desc())
        return list(self.db.scalars(statement).all())

    def get_active_product(self, product_id: int) -> Product | None:
        statement = select(Product).where(Product.id == product_id, Product.is_active.is_(True))
        return self.db.scalar(statement)

    def _product_data(self, payload: ProductCreate | ProductUpdate) -> dict:
        data = payload.model_dump()
        image_urls = data.get('image_urls') or []
        if data.get('image_url') and data['image_url'] not in image_urls:
            image_urls = [data['image_url'], *image_urls]
        image_urls = image_urls[:6]
        data['image_urls'] = image_urls
        data['image_url'] = image_urls[0] if image_urls else None
        return data

    def create_product(self, owner_id: int, payload: ProductCreate) -> Product:
        product = Product(owner_id=owner_id, **self._product_data(payload))
        self.db.add(product)
        self.db.commit()
        self.db.refresh(product)
        return product

    def update_product(self, product: Product, payload: ProductUpdate) -> Product:
        for field, value in self._product_data(payload).items():
            setattr(product, field, value)
        self.db.commit()
        self.db.refresh(product)
        return product
