from fastapi import APIRouter

from was.blueprints.sf import manager

router = APIRouter()

router.include_router(router=manager.router)
