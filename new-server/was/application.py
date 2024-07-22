from flask import Flask
from flask_cors import CORS

from ex.api import API_PREFIX
from ex.flask_ex import load_submodules, register_blueprints
from was import config, model
# from was.assets import assets, static_digest
from was.blueprints import front, admin

app = Flask(__name__)
app.config.from_object(config)

# DB 기능 초기화
model.db.init_app(app)
load_submodules(model)

app_url_prefix = '/app'
front_url_prefix = '/front'
admin_url_prefix = '/admin'
register_blueprints(app, (app, app_url_prefix), (admin, admin_url_prefix), (front, front_url_prefix))

# 개발중에만 활성화 해준다.
if app.debug:
    CORS(app, supports_credentials=True, resources=[
        '*',
        f'{admin_url_prefix}{API_PREFIX}*',
    ])
