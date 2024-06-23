import json
from pathlib import Path
from typing import Any

from was.application import app

server_root_path: Path = Path(__file__).parent.parent
admin_root_path: Path = (server_root_path / '..' / 'admin' / 'openapi.json').resolve()
front_root_path: Path = (server_root_path / '..' / 'front' / 'openapi.json').resolve()
app_root_path: Path = (server_root_path / '..' / 'portfolio_app' / 'openapi.json').resolve()


def generate_openapi_json():
    openapi_schema = app.openapi()
    sf_schema, front_schema, app_schema = filtered_api(openapi_schema)

    save_schema_to_json(sf_schema, admin_root_path)
    save_schema_to_json(front_schema, front_root_path)
    save_schema_to_json(app_schema, app_root_path)


def filtered_api(schema: dict[str, Any]):
    return get_filter_schema(schema, '/sf'), get_filter_schema(schema, '/front'), get_filter_schema(schema, '/app')


def get_filter_schema(schema: dict[str, Any], prefiex: str) -> dict[str, Any]:
    paths = {}
    for path, path_item in schema['paths'].items():
        if path.startswith(prefiex):
            paths[path] = path_item

    return {
        'openapi': schema['openapi'],
        'info': schema['info'],
        'paths': paths,
        'components': schema['components']
    }


def save_schema_to_json(schema: dict[str, Any], file_path: Path):
    with open(file_path, 'w') as json_file:
        json.dump(schema, json_file, indent=2)


if __name__ == '__main__':
    generate_openapi_json()
