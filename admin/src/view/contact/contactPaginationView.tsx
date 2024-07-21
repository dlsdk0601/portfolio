"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { isNil } from "lodash";
import Link from "next/link";
import { Urls } from "../../url/url.g";
import { SearchActionLayoutView } from "../searchActionBarView";
import { SelectView } from "../selectView";
import { ContactType, PaginationContactListResItem } from "../../api/schema.g";
import { contactTypes, labelToContactType } from "../../api/enum";
import { ignorePromise } from "../../ex/utils";
import { api } from "../../api/api";
import { PaginationView } from "../paginationView";

export const ContactPaginationSearchView = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [search, setSearch] = useState("");
  const [type, setType] = useState<ContactType | null>(null);

  useEffect(() => {
    setSearch(params.get("search") ?? "");
    setType(labelToContactType(params.get("type")));
  }, []);

  const onSearch = useCallback(() => {
    router.push(Urls.contact.page.url({ page: 1, search, type: type?.toString() }));
  }, [search, type]);

  return (
    <SearchActionLayoutView onSubmit={() => onSearch()}>
      <SelectView<ContactType | null>
        value={type}
        options={["타입", ...contactTypes].map((item) => ({
          label: item,
          value: labelToContactType(item),
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

export const ContactPaginationView = (props: {
  page: number;
  search: string;
  type: ContactType | null;
}) => {
  const [pagination, setPagination] = useState<PaginationContactListResItem | null>(null);

  useEffect(() => {
    ignorePromise(() => init());
  }, [props]);

  const init = useCallback(async () => {
    const res = await api.contactList({
      page: props.page,
      search: props.search,
      type: props.type,
    });

    if (isNil(res)) {
      return;
    }

    setPagination(res.contacts);
  }, [props]);

  return (
    <PaginationView
      pagination={pagination}
      mapper={(item) => [
        ["ID", item.id],
        ["링크", item.href],
        ["타입", contactTypeToIcon(item.type)],
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

export const contactTypeToIcon = (type: ContactType): ReactNode => {
  switch (type) {
    case ContactType.EMAIL:
      return <i className="mdi mdi-email-outline text-3xl" />;
    case ContactType.GITHUB:
      return <i className="mdi mdi-github text-3xl" />;
    case ContactType.INSTAGRAM:
      return <i className="mdi mdi-instagram text-3xl" />;
    default:
      return <></>;
  }
};
