import { cPk, parseQuery } from "../../../../ex/query";
import { ProjectEditView } from "../../../../view/project/projectEditView";

export interface Query {
  pk: cPk;
}

const Page = (props: { params: Record<string, string> }) => {
  const param = parseQuery<Query>(props.params);

  return <ProjectEditView pk={param.pk ?? null} />;
};

export default Page;
