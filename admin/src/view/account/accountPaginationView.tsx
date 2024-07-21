"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { isNil } from "lodash";
import { Urls } from "../../url/url.g";
import { PaginationView } from "../paginationView";
import { PaginationManagerListResItem } from "../../api/schema.g";
import { GreenBadge, RedBadge } from "../icons";
import { SelectView } from "../selectView";
import { SearchActionLayoutView } from "../searchActionBarView";
import { api } from "../../api/api";
import { ignorePromise } from "../../ex/utils";
import { managerModel } from "../../store/managerModel";
import { Replace } from "../layout/layoutSelector";

export const AccountPaginationSearchView = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [search, setSearch] = useState("");
  const [enable, setEnable] = useState<boolean | null>(null);

  useEffect(() => {
    setSearch(params.get("search") ?? "");

    const queryEnable = params.get("enable");
    setEnable(queryEnable ? queryEnable === "true" : null);
  }, []);

  const onSearch = useCallback(() => {
    router.push(Urls.account.page.url({ page: 1, search, enable: enable ?? undefined }));
  }, [search, enable]);

  return (
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
        className="w-100 rounded-r-lg border border-stroke bg-transparent px-5 py-2.5 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
        placeholder="검색어를 입력주세요."
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </SearchActionLayoutView>
  );
};

export const AccountPaginationView = (props: {
  page: number;
  search: string;
  enable: boolean | null;
}) => {
  const initialize = useRef(false);
  const managerType = managerModel((state) => state.type);
  const [pagination, setPagination] = useState<PaginationManagerListResItem | null>(null);

  useEffect(() => {
    if (initialize.current) {
      return;
    }

    ignorePromise(() => init());
  }, [props, initialize.current]);

  const init = useCallback(async () => {
    const res = await api.managerList({
      page: props.page,
      search: props.search,
      enable: props.enable,
    });

    if (isNil(res)) {
      return;
    }

    setPagination(res.pagination);
    initialize.current = true;
  }, [props]);

  // 수퍼 계정이 아니면 조회되지 않는다.
  if (managerType !== "SUPER") {
    return <Replace url={Urls.profile.page.url()} />;
  }

  return (
    <PaginationView
      pagination={pagination}
      mapper={(item) => [
        ["ID", item.id],
        ["이름", item.name],
        ["상태", <EnableBadge enable={item.enable} />],
        [
          "상세",
          <Link
            href={Urls.account["[pk]"].page.url({ pk: item.pk })}
            className="inline-flex items-center justify-center rounded-md border border-primary px-7 py-4 text-center font-medium text-primary hover:opacity-60 lg:px-4 xl:px-4"
          >
            상세
          </Link>,
        ],
      ]}
    />
  );
};

const EnableBadge = (props: { enable: boolean }) => {
  if (!props.enable) {
    return <RedBadge label="중지" />;
  }

  return <GreenBadge label="정상" />;
};
