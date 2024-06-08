import json

from fastapi.openapi.utils import get_openapi

from was.application import app


def generate_openapi_json():
    openapi_schema = app.openapi()

    with open('openapi.json', 'w') as json_file:
        json.dump(openapi_schema, json_file, indent=2)


if __name__ == '__main__':
    generate_openapi_json()
