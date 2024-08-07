import os
import typing
import typing as t
from abc import abstractmethod
from dataclasses import dataclass
from enum import auto
from functools import partial
from types import GenericAlias
from typing import TypeVar, Generic, Optional, List, Callable, Dict, Any, Type, get_type_hints, Set, Tuple

import pydantic.generics
from flask import Blueprint, Response, request, Flask, current_app
from flask_sqlalchemy import SQLAlchemy
from pydantic import ValidationError
from stringcase import camelcase, spinalcase
# noinspection PyPackageRequirements
from werkzeug.exceptions import HTTPException

from ex.py.enum_ex import StringEnum


class BaseModel(pydantic.BaseModel):
    class Config:
        alias_generator = camelcase
        populate_by_name = True
        arbitrary_types_allowed = True
        by_alias = True


class GenericModel(pydantic.BaseModel):
    class Config:
        alias_generator = camelcase
        populate_by_name = True
        arbitrary_types_allowed = True
        by_alias = True


RES_DATA = TypeVar('RES_DATA', bound=BaseModel)


# noinspection PyArgumentList
class ResStatus(StringEnum):
    OK = auto()
    INVALID_ACCESS_TOKEN = auto()
    EXPIRED_TOKEN = auto()
    NO_PERMISSION = auto()
    NOT_FOUND = auto()
    LOGIN_REQUIRED = auto()


class Res(BaseModel, Generic[RES_DATA]):
    data: RES_DATA | None
    errors: list[str]
    validation_errors: list[dict[str, Any]]
    status: ResStatus


class ApiMethod(StringEnum):
    GET = auto()
    POST = auto()
    PUT = auto()
    PATCH = auto()
    DELETE = auto()


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


class ApiBlueprint(Blueprint, Generic[API_PERMISSION]):
    _api_schemas: List['ApiScheme'] = []
    _app: Flask
    _permissions: Dict[API_ENDPOINT, Tuple[API_PERMISSION, ...]] = {}
    _public_endpoints: Dict[API_ENDPOINT, bool] = {}
    _end_points: Set[str] = set()

    def __init__(self, name: str, import_name: str, static_folder: t.Optional[t.Union[str, os.PathLike]] = None,
                 static_url_path: t.Optional[str] = None, template_folder: t.Optional[str] = None,
                 url_prefix: t.Optional[str] = None, subdomain: t.Optional[str] = None,
                 url_defaults: t.Optional[dict] = None, root_path: t.Optional[str] = None, ):
        super().__init__(name, import_name, static_folder, static_url_path, template_folder, url_prefix, subdomain,
                         url_defaults, root_path)

        self._api_schemas: List['ApiScheme'] = []
        self._permissions: Dict[API_ENDPOINT, Tuple[API_PERMISSION, ...]] = {}
        self._public_endpoints: Dict[API_ENDPOINT, bool] = {}
        self._end_points: Set[str] = set()

    def register(self, app: "Flask", options: dict) -> None:
        super().register(app, options)
        self._app = app

    def api(self, *permissions: API_PERMISSION, public: bool = False, method: ApiMethod = ApiMethod.POST) -> Callable[
        [API_ENDPOINT], API_ENDPOINT]:
        def _decorated(f: API_ENDPOINT) -> API_ENDPOINT:
            self._permissions[f] = permissions
            self._public_endpoints[f] = public
            return self._api(f, method)

        return _decorated

    def _api(self, f: API_ENDPOINT, method: ApiMethod) -> API_ENDPOINT:
        hints = get_type_hints(f)

        req_type: Optional[Type[BaseModel]] = hints.get('req', hints.get('_'))
        assert req_type is not None, 'request 의 이름은 반드시 req 나 _ 로 지정해야 한다.'
        assert issubclass(req_type, BaseModel), 'request 는 반드시 BaseModel 을 상속받아야 한다.'

        # https://www.python.org/dev/peps/pep-0585/#parameters-to-generics-are-available-at-runtime
        res_type: Optional[GenericAlias] = hints.get('return')

        assert res_type is not None, 'response 는 반드시 지정해야 한다.'
        assert hasattr(res_type, '__pydantic_generic_metadata__'), 'response 는 Res[T] 형태의 Generic 으로 선언되어야 한다.'

        res_type_origin = res_type.__pydantic_generic_metadata__['origin']
        res_type_args = res_type.__pydantic_generic_metadata__['args']

        assert res_type_origin == Res, 'response 는 Res 를 사용해야 한다. '
        res_data_type: Type[BaseModel] = res_type_args[0]

        endpoint = f.__name__
        self._end_points.add(endpoint)

        rule = f'{API_PREFIX}{spinalcase(endpoint)}'
        self._api_schemas.append(
            ApiScheme(endpoint=endpoint, url=rule, req=req_type, res_data=res_data_type, method=method))

        self.add_url_rule(
            rule=rule,
            endpoint=endpoint,
            view_func=partial(self._api_wrapper, f, req_type),
            methods=[method]
        )

        # Unit Test 등에서 편리하게 사용하도록 Session.remove 를 전부 넣어준다.
        # 현재는 사용하지 않기 때문에 그냥 무시해둔다.
        @typing.no_type_check
        def _decorated(*args, **kwargs):
            ext: SQLAlchemy = self._app.extensions['sqlalchemy']

            ext.session.remove()
            ret = f(*args, **kwargs)
            ext.session.remove()

            return ret

        return _decorated

    def export_api_schema(self) -> List['ApiScheme']:
        return self._api_schemas

    @abstractmethod
    def validate_permission(self, permissions: Tuple[API_PERMISSION, ...]) -> bool:
        ...

    @abstractmethod
    def validate_login(self) -> bool:
        ...

    def is_api_request(self) -> bool:
        if not request.endpoint:
            return False

        ep = request.endpoint.split('.')
        if len(ep) != 2:
            return False

        bp_name, ep_name = ep
        if bp_name != self.name:
            return False
        return ep_name in self._end_points

    def _api_wrapper(self, f: API_ENDPOINT, req_type: Type[BaseModel]) -> Response:
        res: Res

        permissions = self._permissions.get(f, tuple())
        public = self._public_endpoints.get(f, False)
        if public or (self.validate_login() and self.validate_permission(permissions)):
            try:
                req = req_type.parse_obj(request.get_json(force=True))
            except ValidationError as validation_errors:
                return res_jsonify(
                    Res(data=None, errors=[], validation_errors=validation_errors.errors(), status=ResStatus.OK))
            try:
                res = f(req)
            except HTTPException as e:
                if e.code != 404:
                    raise
                res = Res(data=None, status=ResStatus.NOT_FOUND, errors=[], validation_errors=[])
        else:
            res = Res(data=None, status=ResStatus.NO_PERMISSION, errors=[], validation_errors=[])

        return res_jsonify(res)


@dataclass
class ApiScheme:
    endpoint: str
    url: str
    req: Type[BaseModel]
    res_data: Type[BaseModel]
    method: ApiMethod


# datetime.time 같은 pydantic 의 json encoder 를 사용하기 위해서 직접 response 를 생성한다.


def res_jsonify(res: Res) -> Response:
    return current_app.response_class(
        res.json(by_alias=True)
    )
