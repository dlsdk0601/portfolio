import re
import types
from datetime import datetime, timedelta, date
from enum import Enum
from typing import Type, Any, Tuple, get_origin, TypeVar, get_args, Union
from uuid import UUID

from more_itertools import flatten
from pydantic.fields import FieldInfo
from stringcase import camelcase

from ex.api import BaseModel, ResStatus
from ex.sqlalchemy_ex import Pagination, PageRow
from was import application


def generate() -> None:
    print('// GENERATED CODE - DO NOT MODIFY BY HAND')
    print('// coverage:ignore-file')
    print('// ignore_for_file: constant_identifier_names, unused_import')

    print("import 'package:freezed_annotation/freezed_annotation.dart';")
    print("import './pagination.dart';")
    print("part 'schema.gen.freezed.dart';")
    print("part 'schema.gen.g.dart';")
    print("""
        @freezed
        class Res with _$Res {
            const factory Res({
                required List<String> errors, 
                required List<dynamic> validationErrors,
                required ResStatus status,
            }) = _Res;
            
            factory Res.fromJson(Map<String, Object?> json) => _$ResFromJson(json);
        }
    """)

    api_schemas = list(flatten([i.req, i.res_data] for i in application.application.app.export_api_schema()))
    models: set[Type[BaseModel | Enum]] = get_flat_models_from_models(api_schemas)
    models.add(ResStatus)

    for model in sorted(models, key=lambda x: x.__name__):
        if issubclass(model, Enum):
            print(generate_enum(model))
        elif issubclass(model, Pagination):
            print(generate_pagination_converter(model))
        elif issubclass(model, PageRow):
            continue
        else:
            print(generate_class(model))


def generate_class(model: Type[BaseModel]) -> str:
    name = model.__name__
    properties: list[str] = []
    field: FieldInfo
    for field in model.model_fields.values():
        # annotation, type_ = _field_dart_type(field.annotation)
        type_ = _field_dart_type(field.annotation)
        type_ = 'required ' + type_
        # if annotation:
        #     type_ = annotation + ' ' + type_
        properties.append(f'{type_} {camelcase(field.alias)}')
    constructor_args = ''
    if properties:
        constructor_args = '{' + ', '.join(properties) + '}'

    base_args = list(flatten(map(get_args, getattr(model, '__orig_bases__', []))))
    if base_args:
        base_type_vars = filter(lambda x: isinstance(x, TypeVar), base_args)
        base_type_names = map(lambda x: x.__name__, base_type_vars)
        model_type_variables = '<' + ', '.join(base_type_names) + '>'
    else:
        model_type_variables = ''

    return f"""
    @freezed
    class {name}{model_type_variables} with _${name} implements ToJson {{
        const factory {name}({constructor_args}) = _{name};
        
        factory {name}.fromJson(Map<String, Object?> json) => _${name}FromJson(json);
    }} 
    """


def generate_pagination_converter(model: Type[Pagination]) -> str:
    (type_name, item_type_name) = _parse_pagination_name(model)
    name = _build_pagination_converter_name(type_name, item_type_name)

    return f'''
    class {name}
        extends JsonConverter<
            Pagination<List<PageRow<{item_type_name}>>>,
            Map<String, Object?>
        >
        with PaginationConverter<{item_type_name}> {{
        const {name}();
        
        @override
        {item_type_name} Function(Map<String, Object?> json) getFromJson() {{
            return {item_type_name}.fromJson;
        }}
    }}
    '''


def get_flat_models_from_models(models: list[Type[BaseModel]]) -> set[Type[BaseModel | Enum]]:
    model_set: set[Type[BaseModel | Enum]] = set()

    def process_field_type(field_type, sets):
        origin = get_origin(field_type)
        if origin in {Union, types.UnionType}:
            for arg in get_args(field_type):
                process_field_type(arg, sets)
        elif origin in {list, tuple, set, frozenset}:
            for arg in get_args(field_type):
                process_field_type(arg, sets)
        elif origin is dict:
            for arg in get_args(field_type):
                process_field_type(arg, sets)
        elif isinstance(field_type, type):
            if issubclass(field_type, BaseModel):
                extract_models(field_type, sets)
            elif issubclass(field_type, Enum):
                sets.add(field_type)

    def extract_models(model: Type[BaseModel], sets: set[Type[Union[BaseModel, Enum]]]) -> None:
        if model in sets:
            return
        sets.add(model)

        for field in model.model_fields.values():
            field_type = field.annotation
            process_field_type(field_type, sets)

    for m in models:
        extract_models(m, model_set)

    return model_set


def _parse_pagination_name(model: Type[Pagination]) -> Tuple[str, str]:
    match = re.match(r'^(Pagination)\[([^]]+)]$', model.__name__)
    assert match, f'이름은 반드시 Pagination[?] 형태 여야 합니다 : model.__name__={model.__name__}'
    return match.group(1), match.group(2)


def _build_pagination_converter_name(type_name: str, row_item_type_name: str) -> str:
    return '_' + type_name + row_item_type_name + 'Converter'


# def _field_dart_type(field_type: Any) -> Tuple[str | None, str]:
def _field_dart_type(field_type: Any) -> str:
    origin_type = get_origin(field_type)
    annotation: str | None = None
    type_ = ''
    if field_type is str or field_type is UUID:
        type_ = 'String'
    elif field_type is int:
        type_ = 'int'
    elif field_type is float or field_type is timedelta:
        type_ = 'double'
    elif field_type is bool:
        type_ = 'bool'
    elif field_type is datetime or field_type is date:
        type_ = 'DateTime'
    elif field_type is bytes:
        type_ = 'String'
    elif isinstance(field_type, TypeVar):
        type_ = field_type.__name__
    elif _safe_issubclass(field_type, Enum):
        type_ = field_type.__name__
    elif getattr(field_type, 'Config', None) is not None:
        # Model type
        type_ = field_type.__name__
    elif origin_type is list:
        type_ = 'List<' + ' | '.join(map(lambda arg: _field_dart_type(arg), get_args(field_type))) + '>'
    elif origin_type is dict:
        args = ', '.join(map(lambda arg: _field_dart_type(arg), get_args(field_type)))
        type_ = f'Map<{args}>'
    elif field_type is type(None):
        type_ = 'null'
    elif origin_type is types.UnionType or origin_type is Union:
        pass
    elif field_type is Any:
        type_ = 'dynamic'
    elif _safe_issubclass(field_type, Pagination):
        (type_name, page_row_type_name) = _parse_pagination_name(field_type)
        type_ = f'{type_name}<List<PageRow<{page_row_type_name}>>>'
        annotation = f'@{_build_pagination_converter_name(type_name, page_row_type_name)}()'
    else:
        raise NotImplementedError(
            f'TODO :: 나머지 타입 처리 : '
            f'{field_type=}, {origin_type=}'
        )

    # if origin_type is types.UnionType or origin_type is Union:
    #     type_ += '?'

    # return annotation, type_
    return type_


def generate_enum(model: Type[Enum]) -> str:
    return f"""
        enum {model.__name__} {{ {', '.join(model)} }}
    """


def _safe_issubclass(cls: type, *parents: type) -> bool:
    try:
        return isinstance(cls, type) and issubclass(cls, parents)
    except TypeError:
        return False


if __name__ == '__main__':
    generate()
