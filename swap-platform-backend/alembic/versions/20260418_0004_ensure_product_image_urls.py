"""ensure product image urls

Revision ID: 20260418_0004
Revises: 20260418_0003
Create Date: 2026-04-18 17:30:00
"""

from alembic import op
import sqlalchemy as sa


revision = '20260418_0004'
down_revision = '20260418_0003'
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    columns = {column['name'] for column in inspector.get_columns('products')}
    if 'image_urls' not in columns:
        op.add_column('products', sa.Column('image_urls', sa.JSON(), server_default='[]', nullable=False))


def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    columns = {column['name'] for column in inspector.get_columns('products')}
    if 'image_urls' in columns:
        op.drop_column('products', 'image_urls')
