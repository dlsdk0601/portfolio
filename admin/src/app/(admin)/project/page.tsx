import { SearchParams } from "../../../type/definition";
import { parseQuery } from "../../../ex/query";
import { ProjectPaginationSearchView } from "../../../view/project/projectPaginationView";

export interface Query {
  page: number;
  search: string;
  type: string;
}

const Page = (props: { searchParams: SearchParams }) => {
  const query = parseQuery<Query>(props.searchParams);

  return (
    <section className="data-table-common rounded-sm border border-stroke bg-white py-4 shadow-default dark:border-strokedark dark:bg-boxdark">
      <ProjectPaginationSearchView />
    </section>
  );
};

export default Page;
