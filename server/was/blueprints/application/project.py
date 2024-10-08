from datetime import date, datetime

from flask import request

from ex.api import BaseModel, Res, ok, err
from was.blueprints.application import app
from was.model import db
from was.model.project import Project, ProjectType, ProjectViewLog


class ProjectListReq(BaseModel):
    pass


class ProjectListResItem(BaseModel):
    pk: int
    title: str
    description: str
    issue_at: date
    view_count: int

    @classmethod
    def from_model(cls, project: Project) -> 'ProjectListResItem':
        return cls(
            pk=project.pk, title=project.title,
            description=project.description, issue_at=project.issue_at,
            view_count=project.view_count
        )


class ProjectListRes(BaseModel):
    projects: list[ProjectListResItem]


@app.api(public=True)
def project_list(req: ProjectListReq) -> Res[ProjectListRes]:
    projects = (db
                .session
                .query(Project)
                .filter_by(delete_at=None)
                .order_by(Project.issue_at.desc())
                .all())

    return ok(
        ProjectListRes(
            projects=list(map(lambda x: ProjectListResItem.from_model(x), projects))
        )
    )


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
    view_count: int


@app.api(public=True)
def project_show(req: ProjectShowReq) -> Res[ProjectShowRes]:
    project = db.get_or_404(Project, req.pk)

    if project.delete_at is not None:
        return err('이미 삭제된 데이터입니다.')

    remote_ip = request.remote_addr
    project_view_log = (db.session
                        .query(ProjectViewLog)
                        .filter_by(project_pk=req.pk, remote_ip=remote_ip)
                        .one_or_none())

    if not project_view_log:
        project_view_log = ProjectViewLog(project_pk=req.pk, remote_ip=remote_ip)
        db.session.add(project_view_log)
        db.session.commit()

    return ok(
        ProjectShowRes(
            pk=project.pk, type=project.type, title=project.title, description=project.description,
            website_url=project.website_url, github_url=project.github_url,
            main_text=project.main_text, create_at=project.create_at, view_count=project.view_count
        )
    )
