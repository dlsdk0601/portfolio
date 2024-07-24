from typing import Tuple

from ex.api import ApiBlueprint


class FrontBlueprint(ApiBlueprint[None]):
    def validate_login(self) -> bool:
        return True

    def validate_permission(self, permisssion: Tuple[None, ...]) -> bool:
        # OPT :: 필요하면 처리
        return True


app = FrontBlueprint('front_app', __name__)
