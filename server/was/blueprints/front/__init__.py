from fastapi import APIRouter

from was.blueprints.front import contact

router = APIRouter()

router.include_router(router=contact.router)
