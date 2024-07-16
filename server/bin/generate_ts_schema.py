import json
import os
import subprocess
from pathlib import Path
from typing import Any

from was.application import app

server_root_path: Path = Path(__file__).parent.parent
admin_root_path: Path = (server_root_path / '..' / 'admin').resolve()
front_root_path: Path = (server_root_path / '..' / 'front').resolve()
app_root_path: Path = (server_root_path / '..' / 'portfolio_app').resolve()

file_name = 'openapi.json'


def generate_openapi_json():
    openapi_schema = app.openapi()
    sf_schema, front_schema, app_schema = filtered_api(openapi_schema)

    ts_run_command = 'bun run bin/generateTypes.ts'
    dart_run_command = ''

    save_schema_to_json(sf_schema, admin_root_path, ts_run_command)
    save_schema_to_json(front_schema, front_root_path, ts_run_command)
    save_schema_to_json(app_schema, app_root_path, dart_run_command)


def filtered_api(schema: dict[str, Any]):
    return get_filter_schema(schema, '/sf'), get_filter_schema(schema, '/front'), get_filter_schema(schema, '/app')


def get_filter_schema(schema: dict[str, Any], prefix: str) -> dict[str, Any]:
    paths = {}
    schemas = {
        "HTTPValidationError": schema['components']['schemas']["HTTPValidationError"],
        "ValidationError": schema['components']['schemas']["ValidationError"],
        "ResStatus": schema['components']['schemas']["ResStatus"],
    }
    for path, path_item in schema['paths'].items():
        if path.startswith(prefix):
            paths[path] = path_item
            # schema_name = get_schema_name(path)
            # schemas[f'{schema_name}Req'] = schema['components']['schemas'][f'{schema_name}Req']
            # schemas[f'{schema_name}Res'] = schema['components']['schemas'][f'{schema_name}Res']
            # schemas[f'Res_{schema_name}Res_'] = schema['components']['schemas'][f'Res_{schema_name}Res_']
            # if v := schema['components']['schemas'].get(f'{schema_name}ResItem'):
            #     schemas[f'{schema_name}ResItem'] = v

    return {
        'openapi': schema['openapi'],
        'info': schema['info'],
        'paths': paths,
        'components': schema['components']
        # OPT :: 각 프로젝트에 해당하는 타입만 골라내기 
        # 'components': {
        #     "schemas": schemas
        # }
    }


def get_schema_name(path: str) -> str:
    parts = path.split('/')
    last_parts = parts[-1].split('-')
    name = ''.join(last.capitalize() for last in last_parts)
    return name


def save_schema_to_json(schema: dict[str, Any], root_path: Path, command: str):
    file_path = (root_path / file_name).resolve()
    with open(file_path, 'w') as json_file:
        json.dump(schema, json_file, indent=2)

    os.chdir(root_path)
    subprocess.run(command, shell=True)


if __name__ == '__main__':
    generate_openapi_json()
