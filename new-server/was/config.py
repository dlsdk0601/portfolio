from os import environ

from sconfig import configure

PORT = 5001
DEBUG = False
SECRET_KEY = '30d3ce2d112b78ca50ad16ca4448d9188856a912b57a677efb9e349b8c863263'
SECRET_PASSWORD_BASE_SALT = SECRET_KEY
JWT_SECRET_KEY = ''
ALGORITHM = 'HS256'

# 파일 업로드 제한
FILE_UPLOAD_MAX_SIZE = 100 * 1024 * 1024

# DB -> 한글 정렬을 위한 DB 설정
DB_COLLLNAME = 'und-x-icu'

# SQLAlchemy
SQLALCHEMY_TRACK_MODIFICATIONS = False
SQLALCHEMY_DATABASE_URI = environ.get(
    'DATABASE_URL',
    f'postgres://postgres@{environ.get("DOCKER_HOST", "localhost")}:30322/portfolio'
)
SQLALCHEMY_ECHO = False

# AWS
AWS_BUCKET = ''
AWS_ACCESS_KEY_ID = ''
AWS_SECRET_ACCESS_KEY = ''
AWS_REGION = 'ap-northeast-2'
AWS_FRONT = f'https://{AWS_BUCKET}.s3.ap-northeast-2.amazonaws.com/'

configure(__name__)

# SALT 는 Bytes 타입이어야 한다.
SECRET_PASSWORD_BASE_SALT = bytes.fromhex(SECRET_PASSWORD_BASE_SALT)

if SQLALCHEMY_DATABASE_URI.startswith('postgres://'):
    SQLALCHEMY_DATABASE_URI = 'postgresql://' + SQLALCHEMY_DATABASE_URI.removeprefix('postgres://')
