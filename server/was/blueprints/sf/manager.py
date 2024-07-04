from fastapi import APIRouter
from starlette.requests import Request

from ex.api import Res, ok, no_permission, BaseModel, not_found, err
from ex.sqlalchemy_ex import isearch, Conditions, api_paginate, Pagination
from was.model import db
from was.model.manager import Manager, ManagerType

router = APIRouter(prefix='/manager')


class ManagerListReq(BaseModel):
    page: int
    search: str
    enable: bool | None


class ManagerListResItem(BaseModel):
    pk: int
    id: str
    name: str
    enable: bool

    @classmethod
    def from_model(cls, manager: Manager) -> 'ManagerListResItem':
        return ManagerListResItem(
            pk=manager.pk, id=manager.id, name=manager.name, enable=manager.enable
        )


class ManagerListRes(BaseModel):
    pagination: Pagination[ManagerListResItem]


@router.post('/manager-list')
def manager_list(request: Request, req: ManagerListReq) -> Res[ManagerListRes]:
    bg: Manager | None = request.state.manager

    if bg is None or bg.type != ManagerType.SUPER:
        return no_permission(None)

    conditions: Conditions = [
        Manager.pk != bg.pk,  # 본인 꼐정 조회는 제외
        isearch(req.search, Manager.id, Manager.email, Manager.name),
    ]

    if req.enable is not None:
        conditions.append(Manager.enable == req.enable)

    q = db.sync_session.query(Manager).filter(*conditions).order_by(Manager.pk.desc())
    pagination = api_paginate(query=q, page=req.page, map_=ManagerListResItem.from_model)

    return ok(ManagerListRes(pagination=pagination))


class ManagerShowReq(BaseModel):
    pk: int


class ManagerShowRes(BaseModel):
    pk: int
    id: str
    name: str
    email: str
    phone: str
    job: str
    enable: bool


@router.post('/manager-show')
def manager_show(request: Request, req: ManagerShowReq) -> Res[ManagerShowRes]:
    bg: Manager | None = request.state.manager

    if bg is None or bg.type != ManagerType.SUPER:
        return no_permission(None)

    if bg.pk == req.pk:
        return err('profile setting 페이지를 이용해주세요.')

    manager: Manager | None = db.sync_session.query(Manager).filter_by(pk=req.pk, enable=True).one_or_none()

    if manager is None:
        return not_found(None)

    return ok(ManagerShowRes(
        pk=req.pk, id=req.pk, name=req.name,
        email=req.email, phone=req.phone, job=req.job,
        enable=req.enable
    ))
