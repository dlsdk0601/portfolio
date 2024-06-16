from datetime import timedelta, datetime, timezone
from typing import Union

import jwt
from fastapi import Request
from jwt import ExpiredSignatureError, InvalidTokenError

from ex.api import ResStatus, BaseModel
from was import config


class Token(BaseModel):
    pk: int
    exp: int


def create_jwt_token(data: dict, expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(hours=3)
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta

    to_encode.update({'exp': expire})
    encoded_jwt = jwt.encode(to_encode, config.JWT_SECRET_KEY, config.ALGORITHM)
    return encoded_jwt


def sf_middleware(request: Request) -> int | ResStatus:
    raw_access_token = request.headers.get('Authorization')

    if not raw_access_token:
        return ResStatus.LOGIN_REQUIRED

    access_token = raw_access_token.split('Bearer ')[1]
    if not access_token:
        return ResStatus.LOGIN_REQUIRED

    try:
        token = jwt.decode(access_token, config.JWT_SECRET_KEY, config.ALGORITHM)
        return token.get('pk')
    except ExpiredSignatureError:
        return ResStatus.INVALID_ACCESS_TOKEN
    except InvalidTokenError:
        return ResStatus.INVALID_ACCESS_TOKEN
    except Exception as e:
        print(e)
        return ResStatus.LOGIN_REQUIRED
