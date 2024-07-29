import datetime
import os.path
import re
import sys
import types
from enum import Enum
from typing import Iterable, Type, Any, get_origin, TypeVar, get_args, Union
from uuid import UUID

from more_itertools import flatten
from pydantic import BaseModel
from pydantic.fields import FieldInfo
from stringcase import camelcase
from werkzeug.datastructures import FileStorage

from ex.api import ApiBlueprint, ResStatus, Res
from ex.py.datetime_ex import now
from was import application


def generate(_app: ApiBlueprint) -> None:
    print('/* tslint:disable */')
    print('/* eslint-disable */')
    print(f'// 자동 생성 파일 수정 금지 - {os.path.basename(__file__)} {now()}')
    print('')

    api_schemas = list(flatten([i.req, i.res_data] for i in _app.export_api_schema()))
    models: set[Type[BaseModel | Enum]] = get_flat_models_from_models(api_schemas)
    models.add(ResStatus)
    models.add(Res)
    for model in sorted(models, key=lambda x: x.__name__):
        if issubclass(model, Enum):
            print(generate_enum(model))
        else:
            print(generate_class(model))


def generate_class(model: Type[BaseModel]) -> str:
    name = _de_generic_name(model.__name__)
    properties: list[str] = []
    field: FieldInfo
    for field in model.model_fields.values():
        print('field')
        print(field)
        type_ = _field_type(field.annotation)
        properties.append(f'    {camelcase(field.alias)}: {type_};\n')

    type_parameters = list(map(lambda x: x.__name__, getattr(model, '__parameters__', [])))
    if type_parameters:
        name = name + '<' + '.'.join(type_parameters) + '>'
    src = ''
    src += f'export type {name} = {{\n'
    src += ''.join(properties)
    src += '}};'
    return src


def _field_type(field_type: Any):
    origin_type = get_origin(field_type)
    print('---')
    print(field_type)
    print(origin_type)
    if field_type is str or field_type is UUID:
        type_ = 'string'
    elif field_type is int:
        type_ = 'number'
    elif field_type is bool:
        type_ = 'boolean'
    elif field_type is datetime.datetime:
        type_ = 'string'
    elif field_type is datetime.date:
        type_ = 'string'
    elif field_type is FileStorage:
        type_ = 'File'
    elif field_type is Any:
        type_ = 'any'
    elif isinstance(field_type, TypeVar):
        type_ = field_type.__name__
    elif _safe_issubclass(field_type, Enum):
        type_ = field_type.__name__
    elif getattr(field_type, 'Config', None) is not None:
        # Model Type
        type_ = field_type.__name__
    elif origin_type is list:
        type_ = f'Array<{_field_type(field_type)}>'
    elif origin_type is dict:
        args = ', '.join(map(lambda arg: _field_type(arg), get_args(field_type)))
        type_ = f'Record<{args}>'
    elif origin_type is types.UnionType:
        type_ = ' | '.join(map(lambda arg: _field_type(arg), get_args(field_type)))
    elif field_type is type(None):
        type_ = 'null'

    else:
        raise NotImplementedError(
            f'TODO :: 타입 처리 : '
            f'{field_type=}, {origin_type=}'
        )

    # if not required:
    #     type_ += ' | null'
    return _de_generic_name(type_)


def generate_enum(model: Type[Enum]) -> str:
    return '\n'.join([
        f"export type {model.__name__} = {' | '.join(_quotes(model))};",
        f"export const {camelcase(model.__name__)}Values: {model.__name__}[] = [{', '.join(_quotes(model))}];",
        f"export function to{model.__name__}(str: string) : {model.__name__} | undefined {{",
        f"  switch(str) {{",
        *[f'    case {i}:' for i in _quotes(model)],
        f"      return str",
        f"  }}",
        f"}}"
    ])


def get_flat_models_from_models(models: list[Type[BaseModel]]) -> set[Type[BaseModel | Enum]]:
    model_set: set[Type[BaseModel | Enum]] = set()

    def extract_models(model: Type[BaseModel], sets: set[Type[Union[BaseModel, Enum]]]) -> None:
        if model in sets:
            return
        sets.add(model)

        for field in model.model_fields.values():
            field_type = field.annotation
            origin = get_origin(field_type)
            if origin is Union:
                field_type = get_args(field_type)[0]

            if isinstance(field_type, type) and issubclass(field_type, BaseModel):
                extract_models(field_type, sets)
            elif isinstance(field_type, type) and issubclass(field_type, Enum):
                sets.add(field_type)

    for m in models:
        extract_models(m, model_set)

    return model_set


def _quotes(items: Iterable[str]) -> Iterable[str]:
    return map(_quote, items)


def _quote(item: str) -> str:
    return '"' + item + '"'


def _safe_issubclass(cls: type, *parents: type) -> bool:
    try:
        return issubclass(cls, parents)
    except TypeError:
        return False


def _de_generic_name(name: str) -> str:
    if matched := re.match(r'([^ \[\]]+)\[([^]]+)', name):
        return matched.group(1) + matched.group(2)
    return name


if __name__ == '__main__':
    t = sys.argv[1:][0]
    match t:
        case 'front':
            generate(application.front.app)
        case 'admin':
            generate(application.admin.app)
