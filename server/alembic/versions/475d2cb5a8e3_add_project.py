"""add_project

Revision ID: 475d2cb5a8e3
Revises: 77211e6c312b
Create Date: 2024-08-11 18:36:59.919801

"""
from enum import auto
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

from ex.py.enum_ex import StringEnum

# revision identifiers, used by Alembic.
revision: str = '475d2cb5a8e3'
down_revision: Union[str, None] = '77211e6c312b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


class ProjectType(StringEnum):
    COMPANY = auto()
    PERSONAL = auto()


project_type = postgresql.ENUM(ProjectType, create_type=False, name='projecttype')


def upgrade() -> None:
    project_type.create(op.get_bind())
    op.create_table('project',
                    sa.Column('pk', sa.Integer(), autoincrement=True, nullable=False),
                    sa.Column('type', project_type, nullable=False, comment='타입'),
                    sa.Column('title', sa.String(length=128), nullable=False, comment='프로젝트 타이틀'),
                    sa.Column('description', sa.Text(), nullable=False, comment='프로젝트 간략 설명'),
                    sa.Column('website_url', sa.String(length=128), nullable=False, comment='웹사이트 링크'),
                    sa.Column('github_url', sa.String(length=128), nullable=False, comment='프로젝트 깃허브 링크'),
                    sa.Column('main_text', sa.Text(), nullable=False, comment='프로젝트 주요 설명 MD 형식'),
                    sa.Column('create_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
                    sa.Column('update_at', sa.DateTime(timezone=True), nullable=True),
                    sa.Column('delete_at', sa.DateTime(timezone=True), nullable=True),
                    sa.PrimaryKeyConstraint('pk'),
                    comment='프로젝트'
                    )


def downgrade() -> None:
    op.drop_table('project')
    project_type.drop(op.get_bind())
