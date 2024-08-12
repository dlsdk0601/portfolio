from datetime import datetime
from enum import auto

from sqlalchemy import Enum, String, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column

from ex.py.enum_ex import StringEnum
from was.model import Model


class ContactType(StringEnum):
    INSTAGRAM = auto()
    GITHUB = auto()
    EMAIL = auto()


class Contact(Model):
    pk: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    type: Mapped[ContactType] = mapped_column(Enum(ContactType), nullable=False, comment='연락처 타입')
    id: Mapped[str] = mapped_column(String(64), nullable=False, comment='매체 아이디')
    href: Mapped[str] = mapped_column(String(256), nullable=False, comment='링크')

    create_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    update_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    delete_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    __table_args__ = (
        {'comment': "연락처"}
    )
