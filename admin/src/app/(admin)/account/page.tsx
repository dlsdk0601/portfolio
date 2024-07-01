"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isNil } from "lodash";
import { PaginationView } from "../../../view/paginationView";
import { PaginationManagerListResItem } from "../../../api/schema.g";
import { api } from "../../../api/api";
import { ignorePromise, preventDefaulted } from "../../../ex/utils";
import { GreenBadge, RedBadge } from "../../../view/icons";
import { Urls } from "../../../url/url.g";
import { parseQuery } from "../../../ex/query";

interface Query {
  page: number;
  search: string;
  enable: boolean;
}

const Page = (props: { searchParams: Partial<Query> }) => {
  const query = parseQuery(props.searchParams);
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState<PaginationManagerListResItem | null>(null);

  useEffect(() => {
    ignorePromise(() => init(query));
  }, [props.searchParams]);

  const init = async (parsed: Partial<Query>) => {
    const page = parsed.page ?? 1;
    const s = parsed.search ?? "";
    const enable = parsed.enable ?? null;

    const res = await api.managerList({
      page,
      search: s,
      enable,
    });

    if (isNil(res)) {
      return;
    }

    setPagination(res.pagination);
  };

  const onSearch = () => {
    router.push(Urls.account.page.url({ ...query, page: 1, search }));
  };

  return (
    <section className="data-table-common rounded-sm border border-stroke bg-white py-4 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex justify-between px-8 pb-4">
        <form className="flex w-full justify-between" onSubmit={preventDefaulted(() => onSearch())}>
          <div className="flex items-center">
            <div className="relative z-20 bg-white dark:bg-form-input">
              <select
                className="relative z-20 w-full appearance-none rounded-l-lg border border-stroke bg-transparent py-2.5 pl-7 pr-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                onChange={(e) =>
                  router.push(
                    Urls.account.page.url({ ...query, page: 1, enable: e.target.value === "true" }),
                  )
                }
              >
                <option className="text-body dark:text-bodydark">상태</option>
                <option value="true" className="text-body dark:text-bodydark">
                  정상
                </option>
                <option value="false" className="text-body dark:text-bodydark">
                  중지
                </option>
              </select>
              <span className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g opacity="0.8">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                      fill="#637381"
                    />
                  </g>
                </svg>
              </span>
            </div>

            <input
              className="w-100 rounded-r-lg border border-stroke bg-transparent px-5 py-2.5 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
              placeholder="Search..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center rounded-lg">
            <button
              type="submit"
              className="w-[100px] rounded-l-lg border border-primary bg-primary px-6 font-medium text-white hover:text-white hover:opacity-80 dark:hover:opacity-80 sm:px-6 sm:py-3"
            >
              검색
            </button>
            <button
              type="button"
              className="w-[100px] rounded-r-lg border border-danger bg-danger px-6 font-medium text-white hover:text-white hover:opacity-80 dark:hover:opacity-80 sm:px-6 sm:py-3"
              onClick={() => router.push(Urls.account.page.url())}
            >
              초기화
            </button>
          </div>
        </form>
      </div>

      <PaginationView
        pagination={pagination}
        mapper={(item) => [
          ["ID", item.id],
          ["이름", item.name],
          ["상태", <EnableBadge enable={item.enable} />],
        ]}
        onClicks={pagination?.rows.map(
          (item) => () => router.push(Urls.account["[pk]"].page.urlPk({ pk: item.item.pk })),
        )}
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
