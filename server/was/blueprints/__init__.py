from fastapi import APIRouter

from was.blueprints import sf, front, app

app_prefix = '/app'
front_prefix = '/front'
sf_prefix = '/sf'

router = APIRouter()
router.include_router(app.router, prefix=app_prefix, tags=['app'])
router.include_router(front.router, prefix=front_prefix, tags=['web'])
router.include_router(sf.router, prefix=sf_prefix, tags=['sf'])
