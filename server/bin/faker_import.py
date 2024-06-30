from typing import Callable
from uuid import UUID

import requests
from faker import Faker
from sqlalchemy.orm import Session

from ex.api import BaseModel
from ex.faker_ex import faker_unique, faker_call
from ex.middleware import get_db
from was.model.asset import Asset
from was.model.manager import Manager, ManagerType


def main() -> None:
    importers: list[Callable[[Session, Faker], None]] = [
        _import_manager,
        _import_asset,
    ]
    with get_db() as db:
        for importer in importers:
            print(f'import {importer.__name__.removeprefix("_import_")} ...', flush=True, end='')
            faker = Faker('ko_KR')
            faker.seed_instance(importer.__name__)
            importer(db, faker)
            print('done')


def _import_manager(db: Session, faker: Faker) -> None:
    ids: set[str] = set()

    def new_manager():
        manager_id = faker_unique(faker.email, ids)
        manager = Manager(
            id=manager_id, name=faker.name(),
            password=Manager.hash_password(manager_id),
            email=faker.email(), phone=faker.phone_number(),
            job=faker.job(), type=ManagerType.NORMAL,
            enable=faker.pybool()
        )

        return manager

    managers = faker_call(faker, new_manager, 100)

    # test 계정
    managers[0].id = 'test'
    managers[0].password = Manager.hash_password('1234')
    managers[0].email = 'test@test.com'
    managers[0].phone = '010222333'
    managers[0].job = 'Developer'
    managers[0].type = ManagerType.SUPER
    managers[0].enable = True

    db.add_all(managers)
    db.commit()


class LoremPicsum(BaseModel):
    id: str
    author: str
    width: int
    height: int
    url: str
    download_url: str


def _import_asset(db: Session, faker: Faker) -> None:
    def new_asset(picsum: LoremPicsum) -> Asset:
        asset = Asset(
            name=picsum.id + '.jpg',
            content_type='image/jpeg', uuid=UUID(int=int(picsum.id)),
            url=picsum.download_url + '.jpg',
            download_url=picsum.download_url + '.jpg'
        )

        return asset

    r = requests.get('https://picsum.photos/v2/list', {'page': 1, 'limit': 30})
    r.raise_for_status()
    json = r.json()
    assets = [new_asset(LoremPicsum.parse_obj(i)) for i in json]
    db.add_all(assets)
    db.commit()


if __name__ == '__main__':
    main()
