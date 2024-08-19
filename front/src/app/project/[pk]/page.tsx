import { isNil } from "lodash";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SearchParams } from "../../../type/definitions";
import { parseQuery } from "../../../ex/query";
import { projectShow, projectView } from "../../../action/project";
import ProjectShowHeaderView from "../../../view/project/projectShowHeaderView";
import MdEditorViewer from "../../../view/project/MDEditorViewer";
import ProjectShowSkeletonView from "../../../view/skeleton/projectShowSkeletonView";

export interface Query {
  pk: number;
}

const Page = async (props: { params: SearchParams }) => {
  const param = parseQuery<Query>(props.params);

  if (isNil(param.pk)) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <Suspense fallback={<ProjectShowSkeletonView />}>
        <ProjectShowView pk={param.pk} />
      </Suspense>
    </div>
  );
};

const ProjectShowView = async (props: { pk: number }) => {
  const views = await projectView(props.pk);
  const project = await projectShow(props.pk);

  if (isNil(project) || isNil(views)) {
    return <></>;
  }

  return (
    <>
      <ProjectShowHeaderView
        title={project.title}
        description={project.description}
        githubSite={project.githubUrl}
        websiteUrl={project.websiteUrl}
        views={views}
      />
      <article className="prose prose-zinc prose-quoteless mx-auto px-4 py-12">
        <MdEditorViewer mainText={project.mainText} />
      </article>
    </>
  );
};

export default Page;
