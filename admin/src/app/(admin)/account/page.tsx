"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isNil } from "lodash";
import Link from "next/link";
import { PaginationView } from "../../../view/paginationView";
import { PaginationManagerListResItem } from "../../../api/schema.g";
import { api } from "../../../api/api";
import { ignorePromise } from "../../../ex/utils";
import { GreenBadge, RedBadge } from "../../../view/icons";
import { Urls } from "../../../url/url.g";
import { parseQuery } from "../../../ex/query";
import { SearchActionLayoutView } from "../../../view/searchActionBarView";
import { SelectView } from "../../../view/selectView";

interface Query {
  page: number;
  search: string;
  enable: boolean;
}

const Page = (props: { searchParams: Partial<Query> }) => {
  const query = parseQuery(props.searchParams);
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [enable, setEnable] = useState<boolean | null>(null);
  const [pagination, setPagination] = useState<PaginationManagerListResItem | null>(null);

  useEffect(() => {
    ignorePromise(() => init(query));
  }, [props.searchParams]);

  const init = useCallback(async (parsed: Partial<Query>) => {
    const page = parsed.page ?? 1;
    const searchValue = parsed.search ?? "";
    const enableValue = parsed.enable ?? null;

    const res = await api.managerList({
      page,
      search: searchValue,
      enable: enableValue,
    });

    if (isNil(res)) {
      return;
    }

    setPagination(res.pagination);
  }, []);

  const onSearch = useCallback(() => {
    router.push(Urls.account.page.url({ ...query, page: 1, search, enable: enable ?? undefined }));
  }, [search, enable]);

  return (
    <section className="data-table-common rounded-sm border border-stroke bg-white py-4 shadow-default dark:border-strokedark dark:bg-boxdark">
      <SearchActionLayoutView onSubmit={() => onSearch()}>
        <SelectView<boolean | null>
          value={enable}
          options={["상태", "정상", "중지"].map((item) => ({
            label: item,
            value: item === "상태" ? null : item === "정상",
          }))}
          onChange={(value) => setEnable(value)}
        />

        <input
          className="w-100 rounded-r-lg border border-stroke bg-transparent px-5 py-2.5 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
          placeholder="검색어를 입력주세요."
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </SearchActionLayoutView>

      <PaginationView
        pagination={pagination}
        mapper={(item) => [
          ["ID", item.id],
          ["이름", <Link href={Urls.account["[pk]"].page.url({ pk: item.pk })}>item.name</Link>],
          ["상태", <EnableBadge enable={item.enable} />],
        ]}
      />
    </section>
  );
};

const EnableBadge = (props: { enable: boolean }) => {
  if (!props.enable) {
    return <RedBadge label="중지" />;
  }

  return <GreenBadge label="정상" />;
};

export default Page;
