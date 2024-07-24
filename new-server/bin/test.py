# import datetime
# import os
# import re
# import sys
# from enum import Enum
# from typing import Type, Any, get_origin, TypeVar, get_args, Iterable
# from uuid import UUID
#
# from more_itertools import flatten
# from pydantic import BaseModel
# from pydantic.fields import ModelField
# from pydantic.schema import get_flat_models_from_models
# from starlette.routing import BaseRoute
# from stringcase import camelcase
# from werkzeug.datastructures import FileStorage
#
# from ex.api import ResStatus, Res
# from ex.py.datetime_ex import now
# from was.blueprints import app, front, sf
#
#
# # generate_ts_schema 파일 과 둘중에 뭘 쓸지 고민
# 이 파일 쓰려면 pydantic 이 'pydantic==1.10.14', 이 버전 이여야 한다.
# def main(routes: list | list[BaseRoute]):
#     api_schemas = list(
#         flatten([route.body_field.type_, get_args(route.response_model)[0]] for route in routes))  # type: ignore
#     models: set[Type[BaseModel | Enum]] = get_flat_models_from_models(api_schemas)
#     models.add(ResStatus)
#     models.add(Res)
#     # models.add(AssetNewRes)
#
#     print('/* tslint:disable */')
#     print('/* eslint-disable */')
#     print(f'// 자동생성 파일 수정 금지 - {os.path.basename(__file__)} {now()}')
#     print('')
#     for model in sorted(models, key=lambda x: x.__name__):
#         if issubclass(model, Enum):
#             print(generate_enum(model))
#         else:
#             print(generate_class(model))
#
#
# def generate_class(model: Type[BaseModel]) -> str:
#     name = _de_generic_name(model.__name__)
#     properties: list[str] = []
#     field: ModelField
#     for field in model.__fields__.values():
#         type_ = _filed_ts_type(field.outer_type_, field.type_, bool(field.required))
#         properties.append(f'   {camelcase(field.name)}: {type_};\n')
#
#     type_parameters = list(map(lambda x: x.__name__, getattr(model, '__parameters__', [])))
#     if type_parameters:
#         name = name + '<' + '.'.join(type_parameters) + '>'
#     src = ''
#     src += f'export type {name} = {{\n'
#     src += ''.join(properties)
#     src += '};'
#     return src
#
#
# def _filed_ts_type(outer_type: Any, field_type: Any, required: bool) -> str:
#     origin_type = get_origin(outer_type)
#     if outer_type is str or outer_type is UUID:
#         type_ = 'string'
#     elif outer_type is int:
#         type_ = 'number'
#     elif outer_type is bool:
#         type_ = 'boolean'
#     elif outer_type is datetime.datetime:
#         type_ = 'datetime'
#     elif outer_type is FileStorage:
#         type_ = 'File'
#     elif outer_type is Any:
#         type_ = 'any'
#     elif isinstance(outer_type, TypeVar):
#         type_ = outer_type.__name__
#     elif _safe_issubclass(outer_type, Enum):
#         type_ = outer_type.__name__
#     elif getattr(outer_type, 'Config', None) is not None:
#         # Model type
#         type_ = outer_type.__name__
#     elif origin_type is list:
#         type_ = f'Array<{_filed_ts_type(field_type, field_type, required)}>'
#     elif origin_type is dict:
#         args = ', '.join(map(lambda x: _filed_ts_type(x, x, True), get_args(outer_type)))
#         type_ = f'Record<{args}>'
#     else:
#         raise NotImplementedError(
#             f'TODO :: 나머지 타입 처리 :'
#             f'{outer_type=}, {field_type=}, {origin_type=}'
#         )
#
#     if not required:
#         type_ += ' | null'
#     return _de_generic_name(type_)
#
#
# def generate_enum(model: Type[Enum]) -> str:
#     return '\n'.join([
#         f"export type {model.__name__} = {' | '.join(_quotes(model))};",
#         f"export const {camelcase(model.__name__)}Values: {model.__name__}[] = [{', '.join(_quotes(model))}];",
#         f"export function to{model.__name__}(str: string): {model.__name__} | undefined {{",
#         f"  switch(str) {{",
#         *[f'        case {i}:' for i in _quotes(model)],
#         f"          return str",
#         f"  }}",
#         f"}}"
#     ])
#
#
# def _quotes(items: Iterable[str]) -> Iterable[str]:
#     return map(_quote, items)
#
#
# def _quote(item: str) -> str:
#     return '"' + item + '"'
#
#
# def _de_generic_name(name: str) -> str:
#     if matched := re.match(r'([^ \[\]]+)\[([^]]+)', name):
#         return matched.group(1) + matched.group(2)
#     return name
#
#
# def _safe_issubclass(cls: type, *parents: type) -> bool:
#     try:
#         return issubclass(cls, parents)
#     except TypeError:
#         return False
#
#
# if __name__ == '__main__':
#     which = sys.argv[1:][0]
#     match which:
#         case 'app':
#             main(app.router.routes)
#         case 'front':
#             main(front.router.routes)
#         case default:
#             main(sf.router.routes)
