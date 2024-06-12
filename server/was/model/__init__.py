from typing import Type, TypeAlias

from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.engine import make_url
from fastapi_sqlalchemy import SQLAlchemy

from was import config

db: SQLAlchemy = SQLAlchemy(
    url=make_url(config.SQLALCHEMY_DATABASE_URI),
)

Model = DeclarativeBase
Model = db.Base  # type: ignore