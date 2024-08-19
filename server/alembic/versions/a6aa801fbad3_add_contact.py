"""add_contact

Revision ID: a6aa801fbad3
Revises: 140084fed02d
Create Date: 2024-07-25 00:58:20.805591

"""
from enum import auto
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

from ex.py.enum_ex import StringEnum

# revision identifiers, used by Alembic.
revision: str = 'a6aa801fbad3'
down_revision: Union[str, None] = '140084fed02d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


class ContactType(StringEnum):
    INSTAGRAM = auto()
    GITHUB = auto()
    EMAIL = auto()


contact_type = postgresql.ENUM(ContactType, create_type=False, name='contacttype')


def upgrade() -> None:
    contact_type.create(op.get_bind())
    op.create_table('contact',
                    sa.Column('pk', sa.Integer(), autoincrement=True, nullable=False),
                    sa.Column('type', contact_type, nullable=False, comment='연락처 타입'),
                    sa.Column('id', sa.String(length=64), nullable=False, comment='매체 아이디'),
                    sa.Column('href', sa.String(length=256), nullable=False, comment='링크'),
                    sa.Column('create_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
                    sa.Column('update_at', sa.DateTime(timezone=True), nullable=True),
                    sa.Column('delete_at', sa.DateTime(timezone=True), nullable=True),
                    sa.PrimaryKeyConstraint('pk'),
                    comment='연락처'
                    )


def downgrade() -> None:
    op.drop_table('contact')
    contact_type.drop(op.get_bind())
