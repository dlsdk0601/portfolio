from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi_sqlalchemy import DBSessionMiddleware

from ex.api import ResStatus, Res, err
from ex.middleware import sf_middleware
from was import config, model
from was.blueprints import router

app = FastAPI(
    debug=config.DEBUG
)
app.add_middleware(
    DBSessionMiddleware,
    db=model.db,
    session_args={
        "autoflush": False
    }
)


@app.middleware('http')
async def before_request(request: Request, call_next):
    path = request.url.path

    # admin
    if path.startswith('/sf'):
        if path.startswith('/sf/sign/sign-in'):
            # 로그인은 그냥 넘긴다.
            return await call_next(request)

        manager = sf_middleware(request)

        # token 해석이 잘못되었다면 err 를 뱉는다.
        if isinstance(manager, ResStatus):
            res: Res = Res(data=None, errors=[], status=manager, validation_errors=[])
            return Response(content=res.json())

        if manager is None:
            return Response(content=err('계정이 조회되지 않습니다.'))

        if manager.enable is False:
            return Response(content=err('중지된 계정입니다.'))

        request.state.manager = manager
        return await call_next(request)

    # app
    if path.startswith('/app'):
        return await call_next(request)

    # front
    if path.startswith('/front'):
        return await call_next(request)

    return await call_next(request)

 
# 개발 중에만 활성화 한다.
if app.debug:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(router=router)
