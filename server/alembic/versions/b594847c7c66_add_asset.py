"""add_asset

Revision ID: b594847c7c66
Revises: 7abb794aed8d
Create Date: 2024-06-27 22:02:35.537811

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = 'b594847c7c66'
down_revision: Union[str, None] = '7abb794aed8d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('asset',
                    sa.Column('pk', sa.Integer(), autoincrement=True, nullable=False, comment='기본키'),
                    sa.Column('name', sa.String(length=128), nullable=False, comment='파일명'),
                    sa.Column('content_type', sa.String(length=64), nullable=False, comment='미디어 종류'),
                    sa.Column('uuid', sa.UUID(), nullable=False, comment='고유값'),
                    sa.Column('url', sa.String(length=256), nullable=False, comment='조회 경로'),
                    sa.Column('download_url', sa.String(length=245), nullable=False, comment='다운로드 경로'),
                    sa.PrimaryKeyConstraint('pk'),
                    sa.UniqueConstraint('uuid'),
                    comment='asset'
                    )


def downgrade() -> None:
    op.drop_table('asset')
