from ex.api import BaseModel, Res, ok, no_permission, err
from ex.sqlalchemy_ex import Pagination, Conditions, isearch, api_paginate
from was.blueprints.admin import app, bg
from was.model import db
from was.model.manager import Manager, ManagerType


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


@app.api()
def manager_list(req: ManagerListReq) -> Res[ManagerListRes]:
    manager = bg.manager

    if not manager:
        return no_permission(error=None)

    conditions: Conditions = [
        Manager.pk != manager.pk,
        isearch(req.search, Manager.id, Manager.email, Manager.name)
    ]

    if req.enable is not None:
        conditions.append(Manager.enable == req.enable)

    q = db.select(Manager).filter(*conditions).order_by(Manager.pk.desc())
    pagination = api_paginate(q=q, page=req.page, map_=ManagerListResItem.from_model)

    return ok(ManagerListRes(
        pagination=pagination,
    ))


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


@app.api()
def manager_show(req: ManagerShowReq) -> Res[ManagerShowRes]:
    if bg.pk == req.pk:
        return err('profile setting 페이지를 이용해주세요.')

    manager = db.get_or_404(Manager, req.pk)

    return ok(ManagerShowRes(
        pk=manager.pk, id=manager.id, name=manager.name, email=manager.email,
        phone=manager.phone, job=manager.job, enable=manager.enable
    ))


class ManagerEditReq(BaseModel):
    pk: int | None
    id: str
    name: str
    email: str
    phone: str
    job: str
    enable: bool
    password: str


class ManagerEditRes(BaseModel):
    pk: int


@app.api()
def manager_edit(req: ManagerEditReq) -> Res[ManagerEditRes]:
    manager = bg.manager
    if manager is None or manager.type != ManagerType.SUPER:
        return no_permission(error=None)

    manager = Manager(type=ManagerType.NORMAL)
    db.session.add(manager)

    if req.pk is not None:
        manager = db.get_or_404(Manager, req.pk)

    manager.id = req.id
    manager.name = req.name
    manager.email = req.email
    manager.phone = req.phone
    manager.job = req.job
    manager.enable = req.enable

    db.session.commit()

    return ok(ManagerEditRes(pk=manager.pk))
