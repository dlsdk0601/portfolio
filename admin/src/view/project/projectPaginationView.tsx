"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { isNil } from "lodash";
import {
  PaginationProjectListResItem,
  ProjectType,
  projectTypeValues,
  toProjectType,
} from "../../api/schema.g";
import { SearchActionLayoutView } from "../searchActionBarView";
import { SelectView } from "../selectView";
import { Urls } from "../../url/url.g";
import { ignorePromise } from "../../ex/utils";
import { PaginationView } from "../paginationView";
import { d1 } from "../../ex/dateEx";
import { parseIntSafe } from "../../ex/numberEx";
import { api } from "../../api/api";

export const ProjectPaginationSearchView = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [search, setSearch] = useState("");
  const [type, setType] = useState<ProjectType | null>(null);

  useEffect(() => {
    setSearch(params.get("search") ?? "");
    setType(toProjectType(params.get("type")));
  }, []);

  const onSearch = useCallback(() => {
    router.push(Urls.profile.page.url({ page: 1, search, type: type?.toString }));
  }, [search, type]);

  return (
    <SearchActionLayoutView onSubmit={() => onSearch()}>
      <SelectView<ProjectType | null>
        value={type}
        options={["타입", ...projectTypeValues].map((item) => ({
          label: item,
          value: toProjectType(item),
        }))}
        onChange={(value) => setType(value)}
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

export const ProjectPaginationView = () => {
  const params = useSearchParams();
  const page = params.get("page");
  const search = params.get("search") ?? "";
  const type = params.get("type");
  const [pagination, setPagination] = useState<PaginationProjectListResItem | null>(null);

  useEffect(() => {
    const p = parseIntSafe(page ?? "1") ?? 1;

    ignorePromise(() => init(p, search, toProjectType(type) ?? null));
  }, []);

  const init = useCallback(async (page: number, search: string, type: ProjectType | null) => {
    const res = await api.projectList({
      page,
      search,
      type,
    });

    if (isNil(res)) {
      return;
    }

    setPagination(res.pagination);
  }, []);

  return (
    <PaginationView
      pagination={pagination}
      mapper={(item) => [
        ["타입", item.type === "COMPANY" ? "회사 프로젝트" : "토이 프로젝트"],
        ["프로젝트명", item.title],
        ["생성 일자", d1(item.createAt)],
      ]}
      createLink={Urls.profile.page.url()}
    />
  );
};
