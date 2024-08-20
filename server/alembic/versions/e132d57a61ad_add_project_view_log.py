"""add_project_view_log

Revision ID: e132d57a61ad
Revises: 475d2cb5a8e3
Create Date: 2024-08-19 22:49:09.505390

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = 'e132d57a61ad'
down_revision: Union[str, None] = '475d2cb5a8e3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('project_view_log',
                    sa.Column('pk', sa.Integer(), autoincrement=True, nullable=False),
                    sa.Column('project_pk', sa.Integer(), nullable=False, comment='프로젝트 - FK'),
                    sa.Column('remote_ip', sa.String(length=64), nullable=False, comment='view IP'),
                    sa.Column('create_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
                    sa.ForeignKeyConstraint(['project_pk'], ['project.pk'], ),
                    sa.PrimaryKeyConstraint('pk'),
                    comment='프로젝트 view log'
                    )


def downgrade() -> None:
    op.drop_table('project_view_log')
