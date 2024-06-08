from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_sqlalchemy import DBSessionMiddleware

from was import config

app = FastAPI(
    debug=config.DEBUG
)
app.add_middleware(
    DBSessionMiddleware,
    db_url=config.SQLALCHEMY_DATABASE_URI
)


# 개발 중에만 활성화 한다.
if app.debug:
    app.add_middleware(
        middleware_class=CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


@app.get('/')
def index() -> str:
    return 'hello world'
