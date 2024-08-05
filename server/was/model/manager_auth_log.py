from datetime import datetime

from sqlalchemy import DateTime, func, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from was.model import Model
from was.model.manager import Manager


class ManagerAuthLog(Model):
    pk: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, comment='PK')
    create_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    manager_pk: Mapped[int] = mapped_column(ForeignKey(Manager.pk), nullable=False, comment='관리자 - FK')
    manager: Mapped[Manager] = relationship()
    remote_ip: Mapped[str] = mapped_column(String(64), nullable=False, comment='로그인 IP')

    __table_args__ = (
        {'comment': '관리자 로그인 로그 - ManagerAuthLog'},
    )
