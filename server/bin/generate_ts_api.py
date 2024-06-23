import os

from more_itertools import flatten
from stringcase import camelcase, capitalcase

from ex.py.datetime_ex import now
from was.application import app


def main() -> None:
    print('/* tslint:disable */')
    print('/* eslint-disable */')
    print(f'// 자동생성 파일 수정 금지 - {os.path.basename(__file__)} {now()}')
    print('')

    schemas = app.openapi()
    # Base Class import
    print('import { ApiBase } from "./axios"')
    print('')
    schema_names = set(
        flatten([[f'{pascal_case(key)}Req', f'{pascal_case(key)}Res'] for key, _ in schemas['paths'].items()]))
    print(f"import {'{' + ','.join(schema_names) + '}'} from '../type/type.g';")
    print('')

    # class define
    print(f'export class Api extends ApiBase {{')
    url: str
    for url, value in schemas['paths'].items():
        url_name = pascal_case(url)

        if 'get' in value:
            print(
                f"\treadonly {camelcase(url_name)} = "
                f"this.g<{capitalcase(url_name)}Req, {capitalcase(url_name)}Res>('{url}');"
            )

        if 'post' in value:
            print(
                f"\treadonly {camelcase(url_name)} = "
                f"this.p<{capitalcase(url_name)}Req, {capitalcase(url_name)}Res>('{url}');"
            )

        if 'put' in value:
            print(
                f"\treadonly {camelcase(url_name)} = "
                f"this.pu<{capitalcase(url_name)}Req, {capitalcase(url_name)}Res>('{url}');"
            )

        if 'delete' in value:
            print(
                f"\treadonly {camelcase(url_name)} = "
                f"this.d<{capitalcase(url_name)}Req, {capitalcase(url_name)}Res>('{url}');"
            )
    print('}')


def pascal_case(name: str):
    last_name = name.split('/')[-1]
    url_name_split = list(map(lambda x: capitalcase(x), last_name.split('-')))
    return ''.join(url_name_split)


if __name__ == '__main__':
    main()
