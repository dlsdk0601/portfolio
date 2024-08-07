"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import classNames from "classnames";
import { parseIntSafe } from "../ex/numberEx";

export const PageView = (props: {
  pages: number[];
  prevPage: number;
  nextPage: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageQuery = searchParams.get("page") ?? "1";
  const currentPage = parseIntSafe(pageQuery) ?? 1;

  const onClick = (page: number) => {
    const query = new URLSearchParams(searchParams);
    query.set("page", page.toString());

    router.push(`${pathname}?${query.toString()}`);
  };

  return (
    <div className="p-4 sm:p-6 xl:p-7.5">
      <nav>
        <ul className="mx-auto flex flex-wrap items-center justify-center">
          <li>
            <button
              type="button"
              disabled={!props.hasPrevPage}
              onClick={() => onClick(props.prevPage)}
              className={classNames(
                "flex h-9 w-9 items-center justify-center rounded-l-md border border-stroke dark:border-strokedark dark:hover:border-primary dark:hover:bg-graydark",
                {
                  "hover:border-primary hover:bg-gray hover:text-primary": props.hasPrevPage,
                },
              )}
            >
              <i className="mdi mdi-chevron-left text-2xl" />
            </button>
          </li>
          {props.pages.map((page, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={`page-${page}-${index}`}>
              <button
                type="button"
                onClick={() => onClick(page)}
                className={classNames(
                  "flex items-center justify-center border border-stroke border-l-transparent px-4 py-[5px] font-medium hover:border-primary hover:bg-gray hover:text-primary dark:border-strokedark dark:hover:border-primary dark:hover:bg-graydark",
                  {
                    "bg-gray": currentPage === page,
                  },
                )}
              >
                {page}
              </button>
            </li>
          ))}

          <li>
            <button
              type="button"
              disabled={!props.hasNextPage}
              onClick={() => onClick(props.nextPage)}
              className={classNames(
                "flex h-9 w-9 items-center justify-center rounded-r-md border border-stroke border-l-transparent dark:border-strokedark dark:hover:border-primary dark:hover:bg-graydark",
                {
                  "hover:border-primary hover:bg-gray hover:text-primary": props.hasNextPage,
                },
              )}
            >
              <i className="mdi mdi-chevron-right text-2xl" />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};
