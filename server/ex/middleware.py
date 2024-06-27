from contextlib import contextmanager
from datetime import timedelta, datetime
from typing import Union, Any

import jwt
from fastapi import Request
from jwt import ExpiredSignatureError, InvalidTokenError
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from ex.api import ResStatus, BaseModel
from was import config
from was.model.manager import Manager

# fastapi 는 비동기로 돌아가서 app_context 를 알 수가 없다.
# 알수 있는데 아직 방법을 못찾은 걸수도 있음
# 필요에 따라서 session 을 열러준다.
engine = create_engine(config.SQLALCHEMY_DATABASE_URI)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@contextmanager
def get_db():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


class Token(BaseModel):
    pk: int
    exp: int


def create_jwt_token(pk: int, expires_delta: Union[timedelta, None] = None):
    to_encode: dict[str, Any] = {'pk': pk}.copy()
    expire = datetime.utcnow() + timedelta(hours=3)
    if expires_delta:
        expire = datetime.utcnow() + expires_delta

    to_encode['exp'] = expire
    encoded_jwt = jwt.encode(payload=to_encode, key=config.JWT_SECRET_KEY, algorithm=config.ALGORITHM)
    return encoded_jwt


def sf_middleware(request: Request) -> Manager | ResStatus | None:
    raw_access_token = request.headers.get('Authorization')

    if not raw_access_token:
        return ResStatus.LOGIN_REQUIRED

    access_token = raw_access_token.split('Bearer ')[1]
    if not access_token:
        return ResStatus.LOGIN_REQUIRED
    try:
        token = jwt.decode(jwt=access_token, key=config.JWT_SECRET_KEY, algorithms=[config.ALGORITHM])
        pk = token.get('pk')
        with get_db() as db:
            manager = db.query(Manager).filter_by(pk=pk).one_or_none()
            return manager
    except ExpiredSignatureError:
        return ResStatus.INVALID_ACCESS_TOKEN
    except InvalidTokenError:
        return ResStatus.INVALID_ACCESS_TOKEN
    except Exception as e:
        print(e)
        return ResStatus.LOGIN_REQUIRED
