from fastapi import APIRouter, Request

from ex.api import BaseModel, Res, ok, err
from ex.middleware import create_jwt_token
from was.model import db
from was.model.manager import Manager

router = APIRouter(prefix='/sign')


class SignInReq(BaseModel):
    id: str
    password: str


class SignInRes(BaseModel):
    token: str


@router.post('/sign-in')
def sign_in(req: SignInReq) -> Res[SignInRes]:
    manager = db.session.query(Manager).filter_by(id=req.id).one_or_none()

    if not manager:
        return err('회원이 조회되지 않습니다.')

    if Manager.hash_password(req.password) != manager.password:
        return err('비밀번호가 잘못되었습니다.')

    token = create_jwt_token(data={'pk': manager.pk})

    return ok(SignInRes(token=token))


class AccessTokenReq(BaseModel):
    pass


class AccessTokenRes(BaseModel):
    id: str
    name: str


@router.post('/access-token')
def access_token(request: Request, _: AccessTokenReq) -> Res[AccessTokenRes]:
    manager = db.session.query(Manager).filter_by(pk=request.state.pk).one_or_none()

    if not manager:
        return err('회원이 조회되지 않습니다.\n다시 로그인을 해주세요.')

    return ok(AccessTokenRes(id=manager.id, name=manager.name))
