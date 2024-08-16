import random
from datetime import timedelta, datetime
from typing import Callable
from uuid import UUID

import requests
from faker import Faker
from sqlalchemy import func

from ex.api import BaseModel
from ex.faker_ex import faker_unique, faker_call
from was.application import app
from was.model import db
from was.model.asset import Asset
from was.model.contact import Contact, ContactType
from was.model.manager import Manager, ManagerType
from was.model.project import Project, ProjectType


def main() -> None:
    importers: list[Callable[[Faker], None]] = [
        _import_manager,
        _import_asset,
        _import_contact,
        _import_project,
    ]

    for importer in importers:
        with app.app_context():
            print(f'import {importer.__name__.removeprefix("_import_")} ...', flush=True, end='')
            faker = Faker('ko_KR')
            faker.seed_instance(importer.__name__)
            importer(faker)
            print('done')


def _import_manager(faker: Faker) -> None:
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

    db.session.add_all(managers)
    db.session.commit()


class LoremPicsum(BaseModel):
    id: str
    author: str
    width: int
    height: int
    url: str
    download_url: str


def _import_asset(_: Faker) -> None:
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
    db.session.add_all(assets)
    db.session.commit()


def _import_contact(faker: Faker) -> None:
    contacts = [
        Contact(
            type=ContactType.INSTAGRAM, id='jungin.__.a', href='https://instagram/jungin.__.a'
        ),
        Contact(
            type=ContactType.GITHUB, id='dlsdk0601', href='https://github.com/dlsdk0601'
        ),
        Contact(
            type=ContactType.EMAIL, id='inajung7008@gmail.com', href='mailto:inajung7008@gmail.com'
        ),
    ]

    db.session.add_all(contacts)
    db.session.commit()


def _import_project(faker: Faker) -> None:
    def new_project():
        project = Project(
            type=ProjectType.COMPANY if faker.pybool(50) else ProjectType.PERSONAL,
            title=faker.name(), description=faker.text(10),
            website_url=faker.url(), github_url=faker.url() if faker.pybool(50) else '',
            main_text=generate_markdown_faker(faker),
            issue_at=faker.date_between(start_date=timedelta(days=-30), end_date=datetime.today()),
            delete_at=func.now() if faker.pybool(50) else None
        )

        return project

    projects = faker_call(faker, new_project, 40)
    db.session.add_all(projects)
    db.session.commit()


def generate_markdown_faker(faker: Faker):
    markdown = f"# {faker.catch_phrase()}\n\n"

    markdown += f"## {faker.bs()}\n\n"

    for _ in range(random.randint(2, 4)):
        markdown += f"### {faker.sentence()}\n\n"

        for _ in range(random.randint(1, 3)):
            markdown += f"- {faker.text()}\n"

        markdown += f"\n{faker.paragraph()}\n\n"

    markdown += f"**{faker.word().capitalize()}**: {faker.text()}\n\n"

    markdown += "| " + " | ".join(faker.words(nb=3)) + " |\n"
    markdown += "|" + " --- |" * 3 + "\n"
    for _ in range(3):
        markdown += "| " + " | ".join(faker.words(nb=3)) + " |\n"

    markdown += f"\n[{faker.company()}]({faker.url()})\n"

    return markdown


if __name__ == '__main__':
    main()
