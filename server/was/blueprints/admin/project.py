from datetime import datetime

from sqlalchemy import select, func

from ex.api import BaseModel, Res, ok, err
from ex.sqlalchemy_ex import Pagination, Conditions, null, isearch, api_paginate
from was.blueprints.admin import app
from was.model import db
from was.model.project import ProjectType, Project


class ProjectListReq(BaseModel):
    page: int
    search: str
    type: ProjectType | None


class ProjectListResItem(BaseModel):
    pk: int
    type: ProjectType
    title: str
    create_at: datetime

    @classmethod
    def from_model(cls, project: Project) -> 'ProjectListResItem':
        return cls(
            pk=project.pk, type=project.type,
            title=project.title, create_at=project.create_at
        )


class ProjectListRes(BaseModel):
    pagination: Pagination[ProjectListResItem]


@app.api()
def project_list(req: ProjectListReq) -> Res[ProjectListRes]:
    conditions: Conditions = [
        Project.delete_at == null
    ]

    if req.search:
        conditions.append(isearch(req.search, Project.title))

    if req.type:
        conditions.append(Project.type == req.type)

    q = select(Project).filter(*conditions).order_by(Project.create_at.desc())
    pagination = api_paginate(q=q, page=req.page, map_=ProjectListResItem.from_model)

    return ok(ProjectListRes(pagination=pagination))


class ProjectShowReq(BaseModel):
    pk: int


class ProjectShowRes(BaseModel):
    pk: int
    type: ProjectType
    title: str
    description: str
    website_url: str
    github_url: str
    main_text: str
    create_at: datetime
    update_at: datetime | None


@app.api()
def project_show(req: ProjectShowReq) -> Res[ProjectShowRes]:
    project = db.get_or_404(Project, req.pk)

    if project.delete_at is not None:
        return err('이미 삭제된 데이터 입니다.')

    return ok(
        ProjectShowRes(
            pk=project.pk, type=project.type, title=project.title, description=project.description,
            website_url=project.website_url, github_url=project.github_url,
            main_text=project.main_text, create_at=project.create_at, update_at=project.update_at
        )
    )


class ProjectEditReq(BaseModel):
    pk: int | None
    type: ProjectType
    title: str
    description: str
    website_url: str
    github_url: str
    main_text: str


class ProjectEditRes(BaseModel):
    pk: int


@app.api()
def project_edit(req: ProjectEditReq) -> Res[ProjectEditRes]:
    project = Project()

    if req.pk is not None:
        project = db.get_or_404(Project, req.pk)

    if project.delete_at is not None:
        return err('이미 삭제된 데이터 입니다.')

    project.type = req.type
    project.title = req.title
    project.description = req.description
    project.website_url = req.website_url
    project.github_url = req.github_url
    project.main_text = req.main_text

    db.session.add(project)
    db.session.commit()

    return ok(ProjectEditRes(pk=project.pk))


class ProjectDeleteReq(BaseModel):
    pk: int


class ProjectDeleteRes(BaseModel):
    pk: int


@app.api()
def project_delete(req: ProjectDeleteReq) -> Res[ProjectDeleteRes]:
    project = db.get_or_404(Project, req.pk)

    if project.delete_at is not None:
        return err('이미 삭제된 데이터 입니다.')

    project.delete_at = func.now()
    db.session.commit()

    return ok(ProjectDeleteRes(pk=project.pk))
