from fastapi import APIRouter

from was.blueprints.sf import manager, sign, contact

router = APIRouter()

router.include_router(router=manager.router)
router.include_router(router=sign.router)
router.include_router(router=contact.router)
