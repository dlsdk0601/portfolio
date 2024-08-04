import os
from datetime import datetime
from typing import Tuple

from alembic.script import ScriptDirectory
from flask import Flask, jsonify
from flask_cors import CORS
from sqlalchemy import func, text

from ex.api import API_PREFIX
from ex.flask_ex import load_submodules, register_blueprints
from was import config, model
from was.blueprints import front, admin, application
from was.model import db

app = Flask(__name__)
app.config.from_object(config)

# DB 기능 초기화
model.db.init_app(app)
load_submodules(model)

app_url_prefix = '/application'
front_url_prefix = '/front'
admin_url_prefix = '/admin'
register_blueprints(app, (application, app_url_prefix), (admin, admin_url_prefix), (front, front_url_prefix))

# 개발중에만 활성화 해준다.
if app.debug:
    CORS(app, supports_credentials=True, resources=[
        '*',
        f'{admin_url_prefix}{API_PREFIX}*',
    ])


@app.route('/common/status/check', methods=['GET'])
def check():
    now = db.session.execute(func.current_timestamp()).scalar()
    alembic_version = db.session.execute(text('SELECT version_num from alembic_version;')).scalar_one_or_none()
    git_commit_hash = os.getenv('GIT_COMMIT_HASH', 'N/A')
    alembic_head, revisions = get_alembic_revision()

    res = {
        'git_commit_hash': git_commit_hash,
        'current_now': {
            'database': now.isoformat(),
            'flask': datetime.now().isoformat()
        },
        'migration_history': {
            'current_revision_from_db': alembic_version,
            'current_revision_from_alembic': alembic_head,
            'revisions': revisions
        }
    }

    return jsonify(res)


def get_alembic_revision() -> Tuple[str | None, list[str]]:
    alembic_dir = os.path.join(os.path.dirname(__file__), '..', 'alembic')
    alembic_script_dir = ScriptDirectory(alembic_dir)

    revisions: list[str] = []
    alembic_head = alembic_script_dir.get_current_head()
    alembic_base = alembic_script_dir.get_base()

    for rev in alembic_script_dir.iterate_revisions(alembic_head, alembic_base):
        if rev in revisions:
            continue
        revisions.append(str(rev))

    return alembic_head, revisions
