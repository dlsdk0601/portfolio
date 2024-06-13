from fastapi_sqlalchemy import SQLAlchemy
from sqlalchemy.engine import make_url

from was import config
from was.model import manager

db: SQLAlchemy = SQLAlchemy(
    url=make_url(config.SQLALCHEMY_DATABASE_URI),
)

# TODO :: 하나의 추상 클래스로 한번에 해결 하는 방법 찾아보기
# Model = DeclarativeBase
# Model = db.Base  # type: ignore
meta_datas = [
    manager.Model.metadata
]
