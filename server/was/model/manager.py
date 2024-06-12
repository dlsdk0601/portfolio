import os
import sys
from datetime import datetime


from sqlalchemy import String, DateTime, func, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from was.model import Model


class Manager(Model):
    __tablename__ = 'manager'

    pk: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    id: Mapped[str] = mapped_column(String(128), nullable=False, comment='아이디')
    name: Mapped[str] = mapped_column(String(64), nullable=False, comment='이름')
    password: Mapped[str] = mapped_column(String(128), nullable=False, comment='hash 패스워드')

    create_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    update_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    __table_args__ = (
        {'comment': 'admin - 관리자'}
    )
