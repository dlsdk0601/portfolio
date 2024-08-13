import base64
from io import BytesIO

from ex.api import BaseModel, Res, ok
from was.blueprints.admin import app
from was.model import db
from was.model.asset import Bsset, Asset


class NewAssetReq(BaseModel):
    base64: str
    name: str
    content_type: str


class NewAssetRes(BaseModel):
    bsset: Bsset


@app.api()
def new_asset(req: NewAssetReq) -> Res[NewAssetRes]:
    base64_data = req.base64.split(',')[1]
    image_data = base64.b64decode(base64_data)
    io = BytesIO(image_data)

    asset = Asset.new_(name=req.name, content_type=req.content_type, file=io)

    db.session.add(asset)
    db.session.commit()

    return ok(NewAssetRes(bsset=asset.to_bsset()))
