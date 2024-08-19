import { isNil } from "lodash";
import { notFound } from "next/navigation";
import { SearchParams } from "../../../type/definitions";
import { parseQuery } from "../../../ex/query";
import { projectShow } from "../../../action/project";
import ProjectShowHeaderView from "../../../view/project/projectShowHeaderView";

export interface Query {
  pk: number;
}

const Page = async (props: { params: SearchParams }) => {
  const param = parseQuery<Query>(props.params);

  if (isNil(param.pk)) {
    return notFound();
  }

  const project = await projectShow(param.pk);

  if (isNil(project)) {
    return <></>;
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <ProjectShowHeaderView
        title={project.title}
        description={project.description}
        githubSite={project.githubUrl}
        websiteUrl={project.websiteUrl}
        views={100}
      />
      <article className="prose prose-zinc prose-quoteless mx-auto px-4 py-12">test</article>
    </div>
  );
};

export default Page;
