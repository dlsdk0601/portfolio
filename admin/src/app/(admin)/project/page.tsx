import {
  ProjectPaginationSearchView,
  ProjectPaginationView,
} from "../../../view/project/projectPaginationView";

export interface Query {
  page: number;
  search: string;
  type: string;
}

const Page = () => {
  return (
    <section className="data-table-common rounded-sm border border-stroke bg-white py-4 shadow-default dark:border-strokedark dark:bg-boxdark">
      <ProjectPaginationSearchView />
      <ProjectPaginationView />
    </section>
  );
};

export default Page;
