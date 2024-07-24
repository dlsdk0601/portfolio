from typing import Tuple, Optional

import jwt
from flask import request, Response
from jwt import ExpiredSignatureError, InvalidTokenError

from ex.api import ApiBlueprint, ResStatus, res_jsonify, Res
from ex.flask_ex import global_proxy
from was import config
from was.model import db
from was.model.manager import Manager


class AdminBlueprint(ApiBlueprint[None]):
    def validate_login(self) -> bool:
        return bg.manager is not None

    def validate_permission(self, permisssion: Tuple[None, ...]) -> bool:
        # OPT :: 필요하면 처리
        return True


app = AdminBlueprint('admin_app', __name__)


class ManagerGlobal:
    _MANAGER_PK = 'MANAGER_PK'
    _manager: Optional[Manager]


bg = global_proxy('manager', ManagerGlobal)


def decode_jwt(token: str) -> int | ResStatus:
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
    token = request.headers.get('Authorization')
    pk = decode_jwt(token)
    manager: Manager | None = None

    if isinstance(pk, int):
        manager = db.session.execute(
            db.select(Manager).filter_by(pk=pk)
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
            return res_jsonify(Res(errors=[], status=ResStatus.INVALID_ACCESS_TOKEN, validation_errors=[]))

    return None
