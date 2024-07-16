"""add_contact

Revision ID: 20615fb00247
Revises: b594847c7c66
Create Date: 2024-07-15 22:58:51.208541

"""
from enum import auto
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

from ex.py.enum_ex import StringEnum

# revision identifiers, used by Alembic.
revision: str = '20615fb00247'
down_revision: Union[str, None] = 'b594847c7c66'
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
                    sa.PrimaryKeyConstraint('pk')
                    )


def downgrade() -> None:
    op.drop_table('contact')
    contact_type.drop(op.get_bind())
