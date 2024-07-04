import {
  AccountPaginationSearchView,
  AccountPaginationView,
} from "../../../view/account/accountPaginationView";
import { parseQuery } from "../../../ex/query";

export interface Query {
  page: number;
  search: string;
  enable: boolean;
}

const Page = async (props: { searchParams: Record<string, string> }) => {
  const query = parseQuery<Query>(props.searchParams);

  return (
    <section className="data-table-common rounded-sm border border-stroke bg-white py-4 shadow-default dark:border-strokedark dark:bg-boxdark">
      <AccountPaginationSearchView />

      <AccountPaginationView
        page={query.page ?? 1}
        search={query.search ?? ""}
        enable={query.enable ?? null}
      />
    </section>
  );
};

export default Page;
