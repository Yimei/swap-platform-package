from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.db.session import SessionLocal
from app.models.product import Product
from app.models.user import User


def seed(db: Session) -> None:
    if db.query(User).count() > 0:
        print('Seed skipped: data already exists.')
        return

    user = User(
        name='Demo User',
        email='demo@example.com',
        hashed_password=get_password_hash('password123'),
    )
    db.add(user)
    db.flush()

    products = [
        Product(
            owner_id=user.id,
            title='Combi 嬰兒推車',
            description='功能正常，可折疊，適合外出散步。',
            category='嬰兒用品',
            point_price=450,
            condition='八成新',
            city='台北市',
            image_url='https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1200&q=80',
        ),
        Product(
            owner_id=user.id,
            title='兒童積木組',
            description='顆粒完整，已清潔整理，適合親子共玩。',
            category='玩具',
            point_price=180,
            condition='九成新',
            city='新北市',
            image_url='https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1200&q=80',
        ),
        Product(
            owner_id=user.id,
            title='孕婦哺乳枕',
            description='布套可拆洗，無明顯污損。',
            category='媽媽用品',
            point_price=150,
            condition='八成新',
            city='桃園市',
            image_url='https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80',
        ),
    ]
    db.add_all(products)
    db.commit()
    print('Seed completed. Demo account: demo@example.com / password123')


if __name__ == '__main__':
    with SessionLocal() as db:
        seed(db)
