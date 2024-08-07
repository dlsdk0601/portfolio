"""add_manager_auth_log

Revision ID: 77211e6c312b
Revises: a6aa801fbad3
Create Date: 2024-08-08 01:14:33.157340

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = '77211e6c312b'
down_revision: Union[str, None] = 'a6aa801fbad3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('manager_auth_log',
                    sa.Column('pk', sa.Integer(), autoincrement=True, nullable=False, comment='PK'),
                    sa.Column('create_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
                    sa.Column('manager_pk', sa.Integer(), nullable=False, comment='관리자 - FK'),
                    sa.Column('remote_ip', sa.String(length=64), nullable=False, comment='로그인 IP'),
                    sa.ForeignKeyConstraint(['manager_pk'], ['manager.pk'], ),
                    sa.PrimaryKeyConstraint('pk'),
                    comment='관리자 로그인 로그 - ManagerAuthLog'
                    )


def downgrade() -> None:
    op.drop_table('manager_auth_log')
