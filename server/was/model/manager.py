from datetime import datetime

from sqlalchemy import String, DateTime, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase

from ex.py.hash_ex import hash_password
from was import config

Model = DeclarativeBase
Model = declarative_base()  # type: ignore


class Manager(Model):
    __tablename__ = 'manager'

    pk: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    id: Mapped[str] = mapped_column(String(128), nullable=False, comment='아이디')
    name: Mapped[str] = mapped_column(String(64), nullable=False, comment='이름')
    password: Mapped[str] = mapped_column(String(128), nullable=False, comment='hash 패스워드')

    create_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    update_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    @staticmethod
    def hash_password(password: str) -> str:
        return hash_password(config.SECRET_PASSWORD_BASE_SALT, password)

    __table_args__ = (
        {'comment': 'admin - 관리자'}
    )