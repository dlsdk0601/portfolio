from ex.api import BaseModel, Res, ok, no_permission
from ex.sqlalchemy_ex import Pagination, Conditions, isearch, api_paginate
from was.blueprints.admin import app, bg
from was.model import db
from was.model.manager import Manager


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
