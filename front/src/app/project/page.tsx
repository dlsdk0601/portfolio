import { head, slice } from "lodash";
import { CardArticleView } from "../../view/project/articleView";
import { projectList } from "../../action/project";
import { isNotNil } from "../../ex/utils";

const ProjectListPage = async () => {
  const projects = await projectList();
  const headProject = head(projects);
  const topProjects = slice(projects, 1, 3);
  const subProjects = slice(projects, 3, projects.length);

  return (
    <>
      <div className="mx-auto grid grid-cols-1 gap-8 lg:grid-cols-2">
        {isNotNil(headProject) && <CardArticleView project={headProject} />}

        <div className="mx-auto flex w-full flex-col gap-8 border-t border-gray-900/10 lg:mx-0 lg:border-t-0">
          {topProjects.map((p) => (
            <CardArticleView key={`project-list-${p.pk}`} project={p} />
          ))}
        </div>
      </div>
      <div className="hidden h-px w-full bg-zinc-800 md:block" />

      <div className="mx-auto grid grid-cols-1 gap-4 md:grid-cols-3 lg:mx-0">
        <div className="grid grid-cols-1 gap-4">
          {subProjects
            .filter((_, i) => i % 3 === 0)
            .map((p) => (
              <CardArticleView key={`project-list-${p.pk}`} project={p} />
            ))}
        </div>
        <div className="grid grid-cols-1 gap-4">
          {subProjects
            .filter((_, i) => i % 3 === 1)
            .map((p) => (
              <CardArticleView key={`project-list-${p.pk}`} project={p} />
            ))}
        </div>
        <div className="grid grid-cols-1 gap-4">
          {subProjects
            .filter((_, i) => i % 3 === 2)
            .map((p) => (
              <CardArticleView key={`project-list-${p.pk}`} project={p} />
            ))}
        </div>
      </div>
    </>
  );
};

export default ProjectListPage;
