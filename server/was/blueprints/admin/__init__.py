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


class AdminBlueprint(ApiBlueprint[ManagerType]):
    def validate_login(self) -> bool:
        return bg.manager is not None

    def validate_permission(self, permission: Tuple[ManagerType, ...]) -> bool:
        if bg.manager is None:
            return False

        if not permission:
            return True

        has_permission = True
        for pair in permission:
            type_, p = pair
            if type_ != ManagerType.SUPER:
                has_permission = False

        return has_permission


app = AdminBlueprint('admin_app', __name__)


class ManagerGlobal:
    _MANAGER_PK = 'MANAGER_PK'
    _manager: Optional[Manager]

    def set_manager(self, manager: Manager | None):
        self._manager = manager

    @property
    def manager(self) -> Manager | None:
        return self._manager

    @property
    def pk(self) -> int | None:
        if not self.manager:
            return None

        return self.manager.pk


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
        pure_token = token.split(' ')[1]
        decoded = jwt.decode(pure_token, config.JWT_SECRET_KEY, algorithms=['HS256'])
        pk = decoded.get('pk')

        if pk is None:
            return ResStatus.INVALID_ACCESS_TOKEN

        return pk
    except ExpiredSignatureError:
        return ResStatus.EXPIRED_TOKEN
    except InvalidTokenError:
        return ResStatus.INVALID_ACCESS_TOKEN
    except Exception as e:
        print(e)
        return ResStatus.LOGIN_REQUIRED


@app.before_request
def before_request() -> Response | None:
    require_access_token = True
    match ((request.endpoint or '').split('.', maxsplit=2)):
        case [_, endpoint]:
            if endpoint in ['sign_in', 'refresh']:
                require_access_token = False
        case _:
            # 비 정상적인 상황, 무시하면 로그인 요청이 넘어 갈 것이다.
            pass

    if not require_access_token:
        return None

    token: str | None = request.headers.get('Authorization')
    pk_or_err = decode_jwt(token)
    manager: Manager | None = None

    if isinstance(pk_or_err, int):
        manager = db.get_or_404(Manager, pk_or_err)

    if isinstance(pk_or_err, ResStatus):
        return res_jsonify(Res(data=None, errors=[], status=pk_or_err, validation_errors=[]))

    bg.set_manager(manager)

    return None
