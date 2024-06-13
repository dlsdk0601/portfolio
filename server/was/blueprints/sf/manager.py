from fastapi import APIRouter

from was.model import db
from was.model.manager import Manager

router = APIRouter()


@router.get('/manager')
def manager():
    managers = db.session.query(Manager).all()
    print(managers)
    return 'hello world'
