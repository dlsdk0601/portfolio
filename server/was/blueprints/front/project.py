from datetime import datetime

from ex.api import BaseModel, Res, ok, err
from was.blueprints.front import app
from was.model import db
from was.model.project import Project, ProjectType


class ProjectListReq(BaseModel):
    pass


class ProjectListResItem(BaseModel):
    pk: int
    title: str
    description: str
    create_at: datetime

    @classmethod
    def from_model(cls, project: Project) -> 'ProjectListResItem':
        return cls(
            pk=project.pk, title=project.title,
            description=project.description, create_at=project.create_at
        )


class ProjectListRes(BaseModel):
    projects: list[ProjectListResItem]


# OPT :: 프로젝트가 많을 경우 페이지네이션을 넣고 무한 스크롤을 넣어야한다.
@app.api(public=True)
def project_list(req: ProjectListReq) -> Res[ProjectListRes]:
    projects = (db.session
                .query(Project)
                .filter_by(delete_at=None)
                .order_by(Project.create_at.desc())
                .all())

    return ok(ProjectListRes(
        projects=list(map(lambda x: ProjectListResItem.from_model(x), projects))
    ))


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


@app.api(public=True)
def project_show(req: ProjectShowReq) -> Res[ProjectShowRes]:
    project = db.get_or_404(Project, req.pk)

    if project.delete_at is not None:
        return err('이미 삭제된 데이터 입니다.')

    return ok(
        ProjectShowRes(
            pk=project.pk, type=project.type, title=project.title, description=project.description,
            website_url=project.website_url, github_url=project.github_url,
            main_text=project.main_text, create_at=project.create_at
        )
    )
