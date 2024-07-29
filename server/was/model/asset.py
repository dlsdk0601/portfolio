import uuid as py_uuid
from typing import Union, IO, Optional

import boto3
from sqlalchemy import String, UUID
from sqlalchemy.orm import Mapped, mapped_column
from werkzeug.datastructures import FileStorage

from ex.api import BaseModel
from was import config
from was.model import Model, db


class Bsset(BaseModel):
    uuid: py_uuid.UUID
    name: str
    url: str
    download_url: str
    content_type: str


class Asset(Model):
    pk: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, comment='기본키')
    name: Mapped[str] = mapped_column(String(128), nullable=False, comment='파일명')
    content_type: Mapped[str] = mapped_column(String(64), nullable=False, comment='미디어 종류')
    uuid: 'Mapped[py_uuid.UUID]' = mapped_column(UUID(as_uuid=True), nullable=False, unique=True, comment='고유값')
    url: Mapped[str] = mapped_column(String(256), nullable=False, comment='조회 경로')
    download_url: Mapped[str] = mapped_column(String(245), nullable=False, comment='다운로드 경로')

    __table_args__ = ({'comment': 'asset'})

    @classmethod
    def new_(cls, name, content_type, file: Union[IO[bytes], FileStorage]):
        asset_uuid = py_uuid.uuid4()

        asset = Asset()
        asset.name = name
        asset.content_type = content_type
        asset.uuid = asset_uuid
        asset.url = f'{config.AWS_FRONT}/{name}'
        asset.download_url = f'{config.AWS_FRONT}/{name}'

        boto3.client(
            's3',
            aws_access_key_id=config.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=config.AWS_SECRET_ACCESS_KEY,
            endpoint_url=None,
            region_name=config.AWS_REGION,
        ).upload_fileobj(
            file, config.AWS_BUCKET, name, ExtraArgs={'ContentType': content_type}
        )

        return asset

    @classmethod
    def _from_uuids(cls, uuids: list[py_uuid.UUID]) -> list['Asset']:
        if not uuids:
            return []

        assets = db.session.query(cls).filter(cls.uuid.in_(uuids)).all()

        def asset_key(asset: Asset) -> int:
            for index, uuid in enumerate(uuids):
                if uuid == asset.uuid:
                    return index
            raise IndexError('cannot find uuid from assets')

        assets.sort(key=asset_key)
        return assets

    @classmethod
    def from_uuid(cls, uuid_: py_uuid.UUID) -> Optional['Asset']:
        return db.session.query(cls).filter_by(uuid=uuid_).one_or_none()

    def to_bsset(self) -> Bsset:
        return Bsset(
            uuid=self.uuid, name=self.name, url=self.url,
            download_url=self.download_url,
            content_type=self.content_type,
        )
