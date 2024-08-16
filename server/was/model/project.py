from datetime import datetime, date
from enum import auto

from sqlalchemy import String, Text, DateTime, func, Date
from sqlalchemy.dialects import postgresql
from sqlalchemy.orm import Mapped, mapped_column

from ex.py.enum_ex import StringEnum
from was.model import Model


class ProjectType(StringEnum):
    COMPANY = auto()
    PERSONAL = auto()


class Project(Model):
    pk: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    type: Mapped[ProjectType] = mapped_column(postgresql.ENUM(ProjectType), nullable=False, comment='타입')
    title: Mapped[str] = mapped_column(String(128), nullable=False, comment='프로젝트 타이틀')
    description: Mapped[str] = mapped_column(Text, nullable=False, comment='프로젝트 간략 설명')

    website_url: Mapped[str] = mapped_column(String(128), nullable=False, comment='웹사이트 링크')
    github_url: Mapped[str] = mapped_column(String(128), nullable=False, comment='프로젝트 깃허브 링크')
    main_text: Mapped[str] = mapped_column(Text, nullable=False, comment='프로젝트 주요 설명 MD 형식')
    issue_at: Mapped[date] = mapped_column(Date(), nullable=False, comment='배포 일자')

    create_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    update_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    delete_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    __table_args__ = (
        {'comment': '프로젝트'}
    )
