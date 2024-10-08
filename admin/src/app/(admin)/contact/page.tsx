import React from "react";
import { parseQuery } from "../../../ex/query";
import {
  ContactPaginationSearchView,
  ContactPaginationView,
} from "../../../view/contact/contactPaginationView";
import { toContactType } from "../../../api/schema.g";
import { SearchParams } from "../../../type/definition";

export interface Query {
  page: number;
  search: string;
  type: string;
}

const Page = (props: { searchParams: SearchParams }) => {
  const query = parseQuery<Query>(props.searchParams);

  return (
    <section className="data-table-common rounded-sm border border-stroke bg-white py-4 shadow-default dark:border-strokedark dark:bg-boxdark">
      <ContactPaginationSearchView />

      <ContactPaginationView
        page={query.page ?? 1}
        search={query.search ?? ""}
        type={toContactType(query.type ?? null)}
      />
    </section>
  );
};

export default Page;
