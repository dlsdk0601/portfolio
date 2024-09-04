from datetime import date

from ex.api import BaseModel, Res, ok
from was.blueprints.application import app
from was.model import db
from was.model.project import Project


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
