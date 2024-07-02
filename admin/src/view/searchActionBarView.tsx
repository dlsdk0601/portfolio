"use client";

import React, { PropsWithChildren } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { preventDefaulted } from "../ex/utils";

export const SearchActionLayoutView = (props: PropsWithChildren<{ onSubmit: () => void }>) => {
  const pathname = usePathname();
  return (
    <div className="flex justify-between px-8 pb-4">
      <form
        className="flex w-full justify-between"
        onSubmit={preventDefaulted(() => props.onSubmit())}
      >
        <div className="flex items-center">{props.children}</div>
        <div className="flex items-center rounded-lg">
          <button
            type="submit"
            className="w-[100px] rounded-l-lg border border-primary bg-primary px-6 font-medium text-white hover:text-white hover:opacity-80 dark:hover:opacity-80 sm:px-6 sm:py-3"
          >
            검색
          </button>
          <Link
            className="w-[100px] rounded-r-lg border border-danger bg-danger px-6 font-medium text-white hover:text-white hover:opacity-80 dark:hover:opacity-80 sm:px-6 sm:py-3"
            href={pathname}
          >
            초기화
          </Link>
        </div>
      </form>
    </div>
  );
};
