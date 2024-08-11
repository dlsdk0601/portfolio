import Link from "next/link";
import {
  AccountPaginationSearchView,
  AccountPaginationView,
} from "../../../view/account/accountPaginationView";
import { parseQuery } from "../../../ex/query";
import { Urls } from "../../../url/url.g";
import { SearchParams } from "../../../type/definition";

export interface Query {
  page: number;
  search: string;
  enable: boolean;
}

const Page = async (props: { searchParams: SearchParams }) => {
  const query = parseQuery<Query>(props.searchParams);

  return (
    <section className="data-table-common rounded-sm border border-stroke bg-white py-4 shadow-default dark:border-strokedark dark:bg-boxdark">
      <AccountPaginationSearchView />

      <AccountPaginationView
        page={query.page ?? 1}
        search={query.search ?? ""}
        enable={query.enable ?? null}
      />

      <div className="flex justify-end px-5">
        <Link
          className="inline-flex items-center justify-center rounded-full border-2 border-primary px-10 py-4 text-center font-medium text-primary transition-all hover:bg-primary hover:text-white lg:px-6 xl:px-8"
          href={Urls.account["[pk]"].page.url({ pk: "new" })}
        >
          Button
        </Link>
      </div>
    </section>
  );
};

export default Page;
