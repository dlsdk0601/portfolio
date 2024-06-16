import datetime
from dataclasses import dataclass
from enum import auto
from typing import TypeVar, Generic, Optional, Callable, Any, Type

import pydantic.generics
from stringcase import camelcase

from ex.py.enum_ex import StringEnum


# noinspection PyPackageRequirements


class BaseModel(pydantic.BaseModel):
    class Config:
        alias_generator = camelcase
        populate_by_name = True
        arbitrary_types_allowed = True


class GenericModel(pydantic.BaseModel):
    class Config:
        alias_generator = camelcase
        populate_by_name = True


RES_DATA = TypeVar('RES_DATA', bound=BaseModel)


# noinspection PyArgumentList
class ResStatus(StringEnum):
    OK = auto()
    INVALID_ACCESS_TOKEN = auto()
    NO_PERMISSION = auto()
    NOT_FOUND = auto()
    LOGIN_REQUIRED = auto()


class Res(BaseModel, Generic[RES_DATA]):
    data: Optional[RES_DATA]
    errors: list[str]
    validation_errors: list[dict[str, Any]]
    status: ResStatus


def ok(data: RES_DATA) -> Res[RES_DATA]:
    return Res(data=data, errors=[], validation_errors=[], status=ResStatus.OK)


def err(*errors: str) -> Res[RES_DATA]:
    return Res(data=None, errors=list(errors), validation_errors=[], status=ResStatus.OK)


API_REQ = TypeVar('API_REQ', bound=BaseModel)

API_ENDPOINT = Callable[[API_REQ], Res[RES_DATA]]

API_PREFIX = "/api/"

API_PERMISSION = TypeVar('API_PERMISSION')


@dataclass
class ApiScheme:
    endpoint: str
    url: str
    req: Type[BaseModel]
    res_data: Type[BaseModel]


# OPT :: user_name만 필요해보여서 user_name으로 했는데 user가 필요하면 추후 수정
class Log(BaseModel):
    user_name: str
    at: datetime.datetime


class ManagerLogSet(BaseModel):
    create: Log
    update: Optional[Log]
