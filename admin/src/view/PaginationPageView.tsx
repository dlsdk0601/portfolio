"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import React from "react";
import classNames from "classnames";
import { PaginationLeftArrowIcon, PaginationRightArrowIcon } from "./icons";
import { parseIntSafe } from "../ex/numberEx";

export const PageView = (props: { pages: number[]; prevPage: number; nextPage: number }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageQuery = searchParams.get("page") ?? "1";
  const currentPage = parseIntSafe(pageQuery) ?? 1;

  const setQuery = (page: number) => {
    const query = new URLSearchParams(searchParams);
    query.set("page", page.toString());

    return `${pathname}?${query.toString()}`;
  };

  return (
    <div className="p-4 sm:p-6 xl:p-7.5">
      <nav>
        <ul className="mx-auto flex flex-wrap items-center justify-center">
          <li>
            <Link
              href={setQuery(props.prevPage)}
              className="flex h-9 w-9 items-center justify-center rounded-l-md border border-stroke hover:border-primary hover:bg-gray hover:text-primary dark:border-strokedark dark:hover:border-primary dark:hover:bg-graydark"
            >
              <PaginationLeftArrowIcon />
            </Link>
          </li>
          {props.pages.map((page, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={`page-${page}-${index}`}>
              <Link
                href={setQuery(page)}
                className={classNames(
                  "flex items-center justify-center border border-stroke border-l-transparent px-4 py-[5px] font-medium hover:border-primary hover:bg-gray hover:text-primary dark:border-strokedark dark:hover:border-primary dark:hover:bg-graydark",
                  {
                    "bg-gray": currentPage === page,
                  },
                )}
              >
                {page}
              </Link>
            </li>
          ))}

          <li>
            <Link
              href={setQuery(props.nextPage)}
              className="flex h-9 w-9 items-center justify-center rounded-r-md border border-stroke border-l-transparent hover:border-primary hover:bg-gray hover:text-primary dark:border-strokedark dark:hover:border-primary dark:hover:bg-graydark"
            >
              <PaginationRightArrowIcon />
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
