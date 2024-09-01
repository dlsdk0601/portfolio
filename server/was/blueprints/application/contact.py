from ex.api import BaseModel, Res, ok
from was.blueprints.application import app
from was.model import db
from was.model.contact import ContactType, Contact


class ContactShowReq(BaseModel):
    pass


class ContactShowResItem(BaseModel):
    pk: int
    id: str
    type: ContactType
    href: str

    @classmethod
    def from_model(cls, contact: Contact) -> 'ContactShowResItem':
        return cls(
            pk=contact.pk, id=contact.id, type=contact.type, href=contact.href
        )


class ContactShowRes(BaseModel):
    contacts: list[ContactShowResItem]


@app.api(public=True)
def contact_show(_: ContactShowReq) -> Res[ContactShowRes]:
    contacts = db.session.query(Contact).filter_by(delete_at=None).order_by(Contact.pk).all()

    return ok(ContactShowRes(
        contacts=list(map(lambda x: ContactShowResItem.from_model(x), contacts)),
    ))
