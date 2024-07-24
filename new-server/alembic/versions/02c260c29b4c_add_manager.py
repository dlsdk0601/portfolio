"""add_manager

Revision ID: 02c260c29b4c
Revises: 
Create Date: 2024-07-25 00:51:48.939181

"""
from enum import auto
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

from ex.py.enum_ex import StringEnum

# revision identifiers, used by Alembic.
revision: str = '02c260c29b4c'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


class ManagerType(StringEnum):
    SUPER = auto()
    NORMAL = auto()


manager_type = postgresql.ENUM(ManagerType, create_type=False, name='managertype')


def upgrade() -> None:
    manager_type.create(op.get_bind())
    op.create_table('manager',
                    sa.Column('pk', sa.Integer(), autoincrement=True, nullable=False),
                    sa.Column('type', manager_type, nullable=False, comment='타입'),
                    sa.Column('id', sa.String(length=128), nullable=False, comment='아이디'),
                    sa.Column('password', sa.String(length=128), nullable=False, comment='hash 패스워드'),
                    sa.Column('name', sa.String(length=64), nullable=False, comment='이름'),
                    sa.Column('email', sa.String(length=128), nullable=False, comment='이메일'),
                    sa.Column('phone', sa.String(length=16), nullable=False, comment='핸드폰 번호'),
                    sa.Column('job', sa.String(length=32), nullable=False, comment='직업'),
                    sa.Column('enable', sa.Boolean(), nullable=False, comment='상태'),
                    sa.Column('create_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
                    sa.Column('update_at', sa.DateTime(timezone=True), nullable=True),
                    sa.PrimaryKeyConstraint('pk'),
                    comment='admin - 관리자'
                    )


def downgrade() -> None:
    op.drop_table('manager')
    op.drop_table('manager')
