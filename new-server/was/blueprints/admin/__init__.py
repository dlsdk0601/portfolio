from datetime import timedelta, datetime
from typing import Tuple, Optional, Union, Any

import jwt
from flask import request, Response
from jwt import ExpiredSignatureError, InvalidTokenError

from ex.api import ApiBlueprint, ResStatus, res_jsonify, Res
from ex.flask_ex import global_proxy
from was import config
from was.model import db
from was.model.manager import Manager, ManagerType


class AdminBlueprint(ApiBlueprint[None]):
    def validate_login(self) -> bool:
        return bg.manager is not None

    def validate_permission(self, permission: Tuple[ManagerType]) -> bool:
        if bg.manager is None:
            return False

        if not permission:
            return True

         if permission != ManagerType.SUPER:
             return False

        return False


app = AdminBlueprint('admin_app', __name__)


class ManagerGlobal:
    _MANAGER_PK = 'MANAGER_PK'
    _manager: Optional[Manager]

    def set_manager(self, manager: Manager):
        self._manager = manager

    @property
    def manager(self) -> Manager | None:
        return self._manager


bg = global_proxy('manager', ManagerGlobal)


def create_jwt_token(pk: int, expires_delta: Union[timedelta, None] = None):
    to_encode: dict[str, Any] = {'pk': pk}.copy()
    expire = datetime.utcnow() + timedelta(hours=3)
    if expires_delta:
        expire = datetime.utcnow() + expires_delta

    to_encode['exp'] = expire
    encoded_jwt = jwt.encode(payload=to_encode, key=config.JWT_SECRET_KEY, algorithm=config.ALGORITHM)
    return encoded_jwt


def decode_jwt(token: str | None) -> int | ResStatus:
    if token is None:
        return ResStatus.INVALID_ACCESS_TOKEN
    try:
        decoded = jwt.decode(token, config.JWT_SECRET_KEY, algorithms=['HS256'])
        pk = decoded.get('pk')

        if pk is None:
            return ResStatus.INVALID_ACCESS_TOKEN

        return pk
    except ExpiredSignatureError:
        return ResStatus.INVALID_ACCESS_TOKEN
    except InvalidTokenError:
        return ResStatus.INVALID_ACCESS_TOKEN
    except Exception as e:
        print(e)
        return ResStatus.LOGIN_REQUIRED


@app.before_request
def before_request() -> Response | None:
    token: str | None = request.headers.get('Authorization')
    pk_err = decode_jwt(token)
    manager: Manager | None = None

    if isinstance(pk_err, int):
        manager = db.session.execute(
            db.select(Manager).filter_by(pk=pk_err)
        ).scalar_one_or_none()

    if manager is None:
        require_access_token = True
        match ((request.endpoint or '').split('.', maxsplit=2)):
            case [_, endpoint]:
                if endpoint in ['sign_in']:
                    require_access_token = False
            case _:
                # 비 정상적인 상황, 무시하면 로그인 요청이 넘어 갈 것이다.
                pass
        if require_access_token:
            return res_jsonify(Res(data=None, errors=[], status=ResStatus.INVALID_ACCESS_TOKEN, validation_errors=[]))

    if isinstance(pk_err, ResStatus):
        return res_jsonify(Res(data=None, errors=[], status=pk_err, validation_errors=[]))

    bg.set_manager(manager)

    return None
