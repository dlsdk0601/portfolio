"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { isNil } from "lodash";
import { PaginationView } from "../../../view/paginationView";
import { PaginationManagerListResItem } from "../../../api/schema.g";
import { api } from "../../../api/api";
import { ignorePromise, isNotNil } from "../../../ex/utils";
import { GreenBadge, RedBadge } from "../../../view/icons";
import { parseIntSafe } from "../../../ex/numberEx";

const Page = () => {
  const searchParams = useSearchParams();
  const [pagination, setPagination] = useState<PaginationManagerListResItem | null>(null);

  useEffect(() => {
    const queries: { [key in string]: any } = {};

    Array.from(searchParams.keys()).forEach((key) => {
      queries[key] = searchParams.get(key);
    });

    ignorePromise(() => init(queries));
  }, [searchParams]);

  const init = async (parsed: { page?: string; enable?: string; search?: string }) => {
    const page = parseIntSafe(parsed.page ?? "") ?? 1;
    const search = parsed.search ?? "";
    const enable = isNotNil(parsed.enable) ? parsed.enable === "true" : null;

    const res = await api.managerList({
      page,
      search,
      enable,
    });

    if (isNil(res)) {
      return;
    }

    setPagination(res.pagination);
  };

  return (
    <PaginationView
      pagination={pagination}
      mapper={(item) => [
        ["ID", item.id],
        ["이름", item.name],
        ["상태", <EnableBadge enable={item.enable} />],
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

export default Page;
