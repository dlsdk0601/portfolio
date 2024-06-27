from datetime import datetime
from enum import auto

from sqlalchemy import String, DateTime, func, Enum, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase

from ex.py.enum_ex import StringEnum
from ex.py.hash_ex import hash_password
from was import config

Model = DeclarativeBase
Model = declarative_base()  # type: ignore


class ManagerType(StringEnum):
    SUPER = auto()
    NORMAL = auto()


class Manager(Model):
    __tablename__ = 'manager'

    pk: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    type: Mapped[ManagerType] = mapped_column(Enum(ManagerType), nullable=False, comment='타입')
    id: Mapped[str] = mapped_column(String(128), nullable=False, comment='아이디')
    password: Mapped[str] = mapped_column(String(128), nullable=False, comment='hash 패스워드')
    name: Mapped[str] = mapped_column(String(64), nullable=False, comment='이름')
    email: Mapped[str] = mapped_column(String(128), nullable=False, comment='이메일')
    phone: Mapped[str] = mapped_column(String(16), nullable=False, comment='핸드폰 번호')
    job: Mapped[str] = mapped_column(String(32), nullable=False, comment='직업')
    enable: Mapped[bool] = mapped_column(Boolean, nullable=False, comment='상태')

    create_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    update_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    @staticmethod
    def hash_password(password: str) -> str:
        return hash_password(config.SECRET_PASSWORD_BASE_SALT, password)

    __table_args__ = (
        {'comment': 'admin - 관리자'}
    )
