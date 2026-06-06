"""add wishlist items

Revision ID: 20260516_0003
Revises: 20260418_0002
Create Date: 2026-05-16 21:30:00
"""

from alembic import op
import sqlalchemy as sa


revision = '20260516_0003'
down_revision = '20260418_0002'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'wishlist_items',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('owner_id', sa.Integer(), nullable=False),
        sa.Column('item_name', sa.String(length=150), nullable=False),
        sa.Column('desired_point_price', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['owner_id'], ['users.id'], ondelete='CASCADE'),
    )
    op.create_index(op.f('ix_wishlist_items_id'), 'wishlist_items', ['id'], unique=False)
    op.create_index(op.f('ix_wishlist_items_owner_id'), 'wishlist_items', ['owner_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_wishlist_items_owner_id'), table_name='wishlist_items')
    op.drop_index(op.f('ix_wishlist_items_id'), table_name='wishlist_items')
    op.drop_table('wishlist_items')
