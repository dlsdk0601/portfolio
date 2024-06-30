from itertools import count
from typing import TypeVar, Tuple, Generic, Callable, Union

from sqlalchemy import Index, and_, or_, func
from sqlalchemy.orm import Query
from sqlalchemy.sql import ColumnElement
from sqlalchemy.sql.elements import BooleanClauseList

from ex.api import BaseModel

null: None = None
true: bool = True
false: bool = False


def int_ceil(x: int, y: int) -> int:
    q, r = divmod(x, y)
    if r:
        q += 1
    return q


T = TypeVar('T')
U = TypeVar('U')

PAGE_ROW_ITEM = TypeVar('PAGE_ROW_ITEM', bound=BaseModel)
TableArgs = Tuple[Index | dict[str, str], ...]


class PageRow(BaseModel, Generic[PAGE_ROW_ITEM]):
    no: int
    item: PAGE_ROW_ITEM


class Pagination(BaseModel, Generic[PAGE_ROW_ITEM]):
    page: int
    pages: list[int]
    prev_page: int
    next_page: int
    has_prev: bool
    has_next: bool
    total: int
    rows: list[PageRow[PAGE_ROW_ITEM]]


def api_paginate(query: Query, page: int, map_: Callable[[T], PAGE_ROW_ITEM], per_page: int = 10) -> Pagination[
    PAGE_ROW_ITEM]:
    # OPT :: 같은 조건으로 쿼리르 돌리면 같은 값이 나오겠지만, 불필요하게 두번의 쿼리를 돌릴 필요가 있을까 싶다.
    # flask-SQLAlchemy 에서는 paginate 함수를 제공하지만, fastapi 에서는 없다.
    total = query.count()
    p = query.offset((page - 1) * per_page).limit(per_page).all()

    if total == 0:
        last = 1
    else:
        last = int_ceil(total, per_page)

    first = max(page - 2, 1)
    pages = tuple(range(first, min(last, first + 5) + 1))
    start = (page - 1) * per_page
    items = tuple(map(map_, p))
    items_indexed = tuple(zip(count(total - start, step=-1), items))

    return Pagination(
        page=page,
        pages=list(pages),
        prev_page=max(page - 1, 1),
        next_page=min(page + 1, last),
        has_next=last != page,
        has_prev=page != 1,
        total=total,
        rows=[PageRow(no=index, item=item) for (index, item) in items_indexed]
    )


def icontains(column, string: str):
    return func.lower(column).contains(string.lower(), autoescape=True)


def isearch(string: str, *columns) -> ColumnElement[bool]:
    keywords = list(filter(bool, map(lambda x: x.strip(), string.split(' '))))
    conditions = []

    for column in columns:
        and_conditions = [icontains(column, keyword) for keyword in keywords]
        conditions.append(and_(True, *and_conditions))

    return or_(*conditions)


Condition = Union[ColumnElement[bool], BooleanClauseList]
Conditions = list[Condition]
