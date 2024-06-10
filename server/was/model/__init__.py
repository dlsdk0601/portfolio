from typing import TYPE_CHECKING
from sqlalchemy.orm import declarative_base, sessionmaker


Model = declarative_base()

from .manager import Manager

if TYPE_CHECKING:
    from .manager import Manager
