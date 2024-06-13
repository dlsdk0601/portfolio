"""add_manager

Revision ID: 7abb794aed8d
Revises: 
Create Date: 2024-06-13 23:13:09.288751

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '7abb794aed8d'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('manager',
                    sa.Column('pk', sa.Integer(), autoincrement=True, nullable=False),
                    sa.Column('id', sa.String(length=128), nullable=False, comment='아이디'),
                    sa.Column('name', sa.String(length=64), nullable=False, comment='이름'),
                    sa.Column('password', sa.String(length=128), nullable=False, comment='hash 패스워드'),
                    sa.Column('create_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
                    sa.Column('update_at', sa.DateTime(timezone=True), nullable=True),
                    sa.PrimaryKeyConstraint('pk'),
                    comment='admin - 관리자'
                    )


def downgrade() -> None:
    op.drop_table('manager')
