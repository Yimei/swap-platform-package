"""add user coin balance

Revision ID: 20260418_0002
Revises: 20260403_0001
Create Date: 2026-04-18 15:00:00
"""

from alembic import op
import sqlalchemy as sa


revision = '20260418_0002'
down_revision = '20260403_0001'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('users', sa.Column('coin_balance', sa.Integer(), server_default='500', nullable=False))


def downgrade() -> None:
    op.drop_column('users', 'coin_balance')
