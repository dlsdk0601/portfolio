from itertools import count
from typing import TypeVar, Generic, Union, Tuple, Callable, Any

from flask_sqlalchemy.session import Session
from sqlalchemy import func, or_, and_, text, Index
from sqlalchemy.orm import scoped_session
from sqlalchemy.sql import ColumnElement
from sqlalchemy.sql.elements import BooleanClauseList
from sqlalchemy.sql.selectable import Select

from ex.api import BaseModel, GenericModel
from was.model import db

# user.deleted_at == None 을 별로 좋아하지 않는다.
# user.deleted_at == null
null: None = None
true: bool = True
false: bool = False


def int_ceil(x: int, y: int) -> int:
    """
    equivalent to math.ceil(x / y)
    :param x:
    :param y:
    :return:
    """
    q, r = divmod(x, y)
    if r:
        q += 1
    return q


T = TypeVar('T')
U = TypeVar('U')

PAGE_ROW_ITEM = TypeVar('PAGE_ROW_ITEM', bound=BaseModel)
TableArgs = Tuple[Index | dict[str, str], ...]


class PageRow(GenericModel, Generic[PAGE_ROW_ITEM]):
    no: int
    item: PAGE_ROW_ITEM


class Pagination(GenericModel, Generic[PAGE_ROW_ITEM]):
    page: int
    pages: list[int]
    prev_page: int
    next_page: int
    has_prev: bool
    has_next: bool
    total: int | None
    rows: list[PageRow[PAGE_ROW_ITEM]]


# def api_paginate(q: Select, page, map_: Callable[[T], PAGE_ROW_ITEM], per_page=10) -> Pagination[PAGE_ROW_ITEM]:
def api_paginate(q: Select, page, map_: Callable[[T], PAGE_ROW_ITEM], per_page=10) -> dict[str, Any]:
    p = (db.paginate(q, page=page, per_page=per_page))
    total = p.total
    if total == 0 or total is None:
        last = 1
    else:
        last = int_ceil(total, per_page)

    first = min(max(p.page - 2, 1), max(min(p.page + 2, last) - 4, 1))

    last_page = min(last, first + 4)
    pages = tuple(range(first, last_page + 1))

    start = (page - 1) * per_page
    items = tuple(map(map_, p.items))
    items_indexed = tuple(zip(count(total - start, step=-1), items))

    return Pagination(
        page=p.page,
        pages=pages,
        prev_page=max(p.page - 1, 1),
        next_page=min(p.page + 1, last),
        has_prev=p.has_prev,
        has_next=p.has_next,
        total=total,
        rows=[PageRow[PAGE_ROW_ITEM](no=index, item=item) for (index, item) in items_indexed]
    ).model_dump(by_alias=True)


# https://github.com/sqlalchemy/sqlalchemy/issues/3482
def icontains(column, string: str):
    return func.lower(column).contains(string.lower(), autoescape=True)


def isearch(string: str, *columns):
    keywords = list(filter(bool, map(lambda x: x.strip(), string.split(' '))))

    conditions = []

    for column in columns:
        and_conditions = [icontains(column, keyword) for keyword in keywords]
        conditions.append(and_(True, *and_conditions))

    return or_(*conditions)


def pg_xlock2(session: Session | scoped_session[Session], group_id: int, lock_id: int) -> None:
    session.execute(
        text('select pg_advisory_xact_lock(:group_id, :lock_id)'),
        {'group_id': group_id, 'lock_id': lock_id}
    )


def pg_try_xlock2(session: Session | scoped_session[Session], group_id: int, lock_id: int) -> bool:
    return session.scalar(
        text('select pg_try_advisory_xact_lock(:group_id, :lock_id)'),
        {'group_id': group_id, 'lock_id': lock_id}
    )


Condition = Union[ColumnElement[bool], BooleanClauseList]
Conditions = list[Condition]
