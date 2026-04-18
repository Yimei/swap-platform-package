"""add product image urls

Revision ID: 20260418_0003
Revises: 20260418_0002
Create Date: 2026-04-18 17:00:00
"""

from alembic import op
import sqlalchemy as sa


revision = '20260418_0003'
down_revision = '20260418_0002'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('products', sa.Column('image_urls', sa.JSON(), server_default='[]', nullable=False))


def downgrade() -> None:
    op.drop_column('products', 'image_urls')
