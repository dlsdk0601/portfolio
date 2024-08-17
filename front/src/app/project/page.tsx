import { head, isNil, slice } from "lodash";
import { Suspense } from "react";
import { CardArticleView } from "../../view/project/articleView";
import { projectList } from "../../action/project";
import { isNotNil } from "../../ex/utils";
import NavigationView from "../../view/contact/NavigationView";
import ProjectListSkeletonView from "../../view/skeleton/projectListSkeletonView";

const ProjectListPage = () => {
  return (
    <div className="relative pb-16">
      <NavigationView />
      <div className="mx-auto max-w-7xl space-y-8 px-6 pt-20 md:space-y-16 md:pt-24 lg:px-8 lg:pt-32">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">Projects</h2>
          <p className="mt-4 text-zinc-400">
            Some of the projects are from work and some are on my own time.
          </p>
        </div>
        <div className="h-px w-full bg-zinc-800" />
        <Suspense fallback={<ProjectListSkeletonView />}>
          <ProjectListView />
        </Suspense>
      </div>
    </div>
  );
};

const ProjectListView = async () => {
  const projects = await projectList();

  if (isNil(projects)) {
    return <></>;
  }

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
