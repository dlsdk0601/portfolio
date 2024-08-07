import React, { ReactNode } from "react";
import { isNil } from "lodash";
import Link from "next/link";
import { Pagination } from "../type/definition";
import { PageView } from "./PaginationPageView";
import { isNotNil } from "../ex/utils";

export type TableViewRowItem = [string | ReactNode, ReactNode];
export type TableViewRow = TableViewRowItem[];

export const PaginationView = <T extends any>(props: {
  pagination: Pagination<T> | null;
  mapper: (item: T) => TableViewRow;
  createLink?: string;
}) => {
  if (isNil(props.pagination)) {
    return <div className="h-[500px]" />;
  }

  if (props.pagination.total === 0) {
    return (
      <div className="rounded-sm px-5 pb-2.5 pt-6 dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="mb-6 flex items-center justify-between">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Total: {props.pagination.total}
          </h4>
          {isNotNil(props.createLink) && (
            <Link
              href={props.createLink}
              className="block w-[100px] rounded border bg-success px-4 text-center font-medium text-white hover:opacity-80 dark:hover:opacity-80 sm:px-4 sm:py-3"
            >
              등록
            </Link>
          )}
        </div>
        <div className="h-[350px] max-w-full overflow-x-auto">
          <p className="my-5 text-center">조회된 데이터가 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-sm px-5 pb-2.5 pt-6 dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="mb-6 flex items-center justify-between">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Total: {props.pagination.total}
        </h4>
        {isNotNil(props.createLink) && (
          <Link
            href={props.createLink}
            className="block w-[100px] rounded border bg-success px-4 text-center font-medium text-white hover:opacity-80 dark:hover:opacity-80 sm:px-4 sm:py-3"
          >
            등록
          </Link>
        )}
      </div>
      <div className="max-w-full overflow-x-auto">
        <TableView
          rows={props.pagination.rows.map((entry) => [
            ["번호", entry.no],
            ...props.mapper(entry.item),
          ])}
        />

        <PageView
          pages={props.pagination.pages}
          prevPage={props.pagination.prevPage}
          nextPage={props.pagination.nextPage}
          hasPrevPage={props.pagination.hasPrev}
          hasNextPage={props.pagination.hasNext}
        />
      </div>
    </div>
  );
};

export const TableView = (props: { rows: TableViewRow[] }) => {
  return (
    <table className="w-full table-auto">
      <thead>
        <tr className="bg-gray-2 text-left dark:bg-meta-4">
          {(props.rows[0] ?? []).map(([header]) => (
            <th
              key={`pagination-header-th-${header}`}
              className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.rows.map((row, index) => (
          <tr
            // eslint-disable-next-line react/no-array-index-key
            key={`pagination-tbody-tr-${row}`}
            className="hover:bg-gray dark:hover:bg-bodydark1"
          >
            {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
            {row.map(([_, data], rowIndex) => (
              <td
                // eslint-disable-next-line react/no-array-index-key
                key={rowIndex}
                className="border-b border-[#eee] px-4 py-5 dark:border-strokedark xl:pl-11"
              >
                <span className="text-black dark:text-white">{data}</span>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
