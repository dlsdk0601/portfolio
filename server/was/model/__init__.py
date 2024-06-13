from typing import Type, TypeAlias

from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.engine import make_url
from fastapi_sqlalchemy import SQLAlchemy
import was.model.manager

from was import config

db: SQLAlchemy = SQLAlchemy(
    url=make_url(config.SQLALCHEMY_DATABASE_URI),
)

# TODO :: 하나의 추상 클래스로 한번에 해결 하는 방법 찾아보기
# Model = DeclarativeBase
# Model = db.Base  # type: ignore
meta_datas = [
    manager.Model.metadata
]