from datetime import timedelta

from flask import request

from ex.api import BaseModel, Res, err, ok, ResStatus, login_required
from was.blueprints.admin import app, decode_jwt, create_jwt_token, bg
from was.model import db
from was.model.manager import Manager, ManagerType
from was.model.manager_auth_log import ManagerAuthLog


class SignInReq(BaseModel):
    id: str
    password: str


class SignInRes(BaseModel):
    token: str
    refresh_token: str


@app.api(public=True)
def sign_in(req: SignInReq) -> Res[SignInRes]:
    manager: Manager | None = db.session.query(Manager).filter_by(id=req.id).one_or_none()

    if manager is None:
        return err('회원이 조회되지 않습니다.')

    if Manager.hash_password(req.password) != manager.password:
        return err('비밀번호가 잘못되었습니다.')

    if manager.enable is False:
        return err('중지된 계정입니다.')

    token = create_jwt_token(pk=manager.pk)
    refresh_token = create_jwt_token(pk=manager.pk, expires_delta=timedelta(days=7))
    log = ManagerAuthLog(
        manager=manager, remote_ip=request.remote_addr
    )

    db.session.add(log)
    db.session.commit()

    return ok(SignInRes(token=token, refresh_token=refresh_token))


class RefreshTokenReq(BaseModel):
    pass


class RefreshTokenRes(BaseModel):
    token: str


@app.api(public=True)
def refresh(_: RefreshTokenReq) -> Res[RefreshTokenRes]:
    refresh_token: str | None = request.headers.get('Authorization')
    pk_or_err = decode_jwt(refresh_token)

    if isinstance(pk_or_err, ResStatus):
        return login_required(error='로그인을 다시 해주세요.')

    manager = db.get_or_404(Manager, pk_or_err)
    remote_ip = str({key: val for key, val in request.headers.items()})
    token = create_jwt_token(pk=pk_or_err)

    log = ManagerAuthLog(
        manager=manager, remote_ip=remote_ip
    )

    db.session.add(log)
    db.session.commit()

    return ok(RefreshTokenRes(token=token))


class ProfileReq(BaseModel):
    pass


class ProfileRes(BaseModel):
    pk: int
    id: str
    name: str
    email: str
    phone: str
    job: str
    type: ManagerType


@app.api()
def profile(_: ProfileReq) -> Res[ProfileRes]:
    manager = bg.manager

    if not manager:
        return err('회원이 조회되지 않습니다.\n다시 로그인을 해주세요.')

    return ok(ProfileRes(
        pk=manager.pk, id=manager.id, name=manager.name,
        email=manager.email, phone=manager.phone, job=manager.job,
        type=manager.type
    ))
