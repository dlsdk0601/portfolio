import datetime
from dataclasses import dataclass
from enum import auto
from typing import TypeVar, Generic, Optional, Callable, Any, Type

import pydantic
from stringcase import camelcase

from ex.py.enum_ex import StringEnum


class BaseModel(pydantic.BaseModel):
    class Config:
        alias_generator = camelcase
        populate_by_name = True
        arbitrary_types_allowed = True
        from_attributes = True


# class GenericModel(pydantic.generics):
#     class Config:
#         alias_generator = camelcase
#         allow_population_by_field_name = True
#         arbitrary_types_allowed = True


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


def no_permission(error: str | None) -> Res[RES_DATA]:
    errors = list(error) if error else ['권한이 없습니다.']
    return Res(data=None, errors=errors, validation_errors=[], status=ResStatus.NO_PERMISSION)


def not_found(error: str | None) -> Res[RES_DATA]:
    errors = list(error) if error else ['데이터를 조회할 수 없습니다.']
    return Res(data=None, errors=errors, validation_errors=[], status=ResStatus.NOT_FOUND)


def login_required(error: str | None) -> Res[RES_DATA]:
    errors = list(error) if error else ['로그인을 먼저 해주세요.']
    return Res(data=None, errors=errors, validation_errors=[], status=ResStatus.LOGIN_REQUIRED)


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
