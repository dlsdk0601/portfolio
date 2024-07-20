from fastapi import APIRouter
from starlette.requests import Request

from ex.api import BaseModel, Res, no_permission, ok
from ex.sqlalchemy_ex import Pagination, Conditions, isearch, api_paginate
from was.model import db
from was.model.contact import ContactType, Contact
from was.model.manager import Manager

router = APIRouter(prefix='/contact')


class ContactListReq(BaseModel):
    page: int
    search: str
    type: ContactType


class ContactListResItem(BaseModel):
    pk: int
    type: ContactType
    id: str
    href: str

    @classmethod
    def from_model(cls, contact: Contact) -> 'ContactListResItem':
        return ContactListResItem(
            pk=contact.pk, type=contact.type, id=contact.id, href=contact.href
        )


class ContactListRes(BaseModel):
    contacts: Pagination[ContactListResItem]


@router.post('/contact-list')
def contact_list(request: Request, req: ContactListReq) -> Res[ContactListRes]:
    bg: Manager | None = request.state.manager

    if bg is None:
        return no_permission(None)

    conditions: Conditions = [
        isearch(req.search, Contact.id, Contact.href)
    ]

    q = db.sync_session.query(Contact).filter(*conditions).order_by(Contact.pk.desc())
    pagination = api_paginate(query=q, page=req.page, map_=ContactListResItem.from_model)

    return ok(
        ContactListRes(
            contacts=pagination
        )
    )
