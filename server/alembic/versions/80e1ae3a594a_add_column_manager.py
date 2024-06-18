"""add_column_manager

Revision ID: 80e1ae3a594a
Revises: 7abb794aed8d
Create Date: 2024-06-18 22:37:16.386677

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = '80e1ae3a594a'
down_revision: Union[str, None] = '7abb794aed8d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('manager', sa.Column('email', sa.String(length=128), nullable=False, comment='이메일'))
    op.add_column('manager', sa.Column('phone', sa.String(length=16), nullable=False, comment='핸드폰 번호'))


def downgrade() -> None:
    op.drop_column('manager', 'phone')
    op.drop_column('manager', 'email')
