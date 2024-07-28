from sqlalchemy import select

from ex.api import BaseModel, Res, ok
from ex.sqlalchemy_ex import Pagination, Conditions, isearch, api_paginate, null
from was.blueprints.admin import app
from was.model.contact import ContactType, Contact


class ContactListReq(BaseModel):
    page: int
    search: str
    type: ContactType | None


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
    pagination: Pagination[ContactListResItem]


@app.api()
def contact_list(req: ContactListReq) -> Res[ContactListRes]:
    conditions: Conditions = [
        Contact.delete_at == null,
        isearch(req.search, Contact.id, Contact.href)
    ]

    if req.type is not None:
        conditions.append(Contact.type == req.type)

    q = select(Contact).filter(*conditions).order_by(Contact.pk.desc())
    pagination = api_paginate(q=q, page=req.page, map_=ContactListResItem.from_model)

    return ok(ContactListRes(pagination=pagination))
