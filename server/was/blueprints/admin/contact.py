from sqlalchemy import select, func

from ex.api import BaseModel, Res, ok, err
from ex.sqlalchemy_ex import Pagination, Conditions, isearch, api_paginate, null
from was.blueprints.admin import app
from was.model import db
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


class ContactShowReq(BaseModel):
    pk: int


class ContactShowRes(BaseModel):
    pk: int
    type: ContactType
    id: str
    href: str


@app.api()
def contact_show(req: ContactShowReq) -> Res[ContactShowRes]:
    contact = db.get_or_404(Contact, req.pk)

    if contact.delete_at is not None:
        return err('이미 삭제된 데이터 입니다.')

    return ok(
        ContactShowRes(
            pk=contact.pk, type=contact.type,
            id=contact.id, href=contact.href,
        )
    )


class ContactEditReq(BaseModel):
    pk: int | None
    type: ContactType
    id: str
    href: str


class ContactEditRes(BaseModel):
    pk: int


@app.api()
def contact_edit(req: ContactEditReq) -> Res[ContactEditRes]:
    contact = Contact()

    if req.pk is not None:
        contact = db.get_or_404(Contact, req.pk)

    if contact.delete_at is not None:
        return err('이미 삭제된 데이터 입니다.')

    contact.type = req.type
    contact.id = req.id
    contact.href = req.href

    db.session.add(contact)
    db.session.commit()

    return ok(ContactEditRes(pk=contact.pk))


class ContactDeleteReq(BaseModel):
    pk: int


class ContactDeleteRes(BaseModel):
    pk: int


@app.api()
def contact_delete(req: ContactDeleteReq) -> Res[ContactDeleteRes]:
    contact = db.get_or_404(Contact, req.pk)

    if contact.delete_at is not None:
        return err('이미 삭제된 데이터 입니다.')

    contact.delete_at = func.now()
    db.session.commit()

    return ok(ContactDeleteRes(pk=contact.pk))
