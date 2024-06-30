import React, { ReactNode } from "react";
import { isNil } from "lodash";
import { Pagination } from "../type/definition";
import { PageView } from "./PaginationPageView";

export type TableViewRowItem = [string | ReactNode, ReactNode];
export type TableViewRow = TableViewRowItem[];

export const PaginationView = <T extends any>(props: {
  pagination: Pagination<T> | null;
  mapper: (item: T) => TableViewRow;
}) => {
  if (isNil(props.pagination)) {
    return <div className="h-[500px]" />;
  }

  if (props.pagination.total === 0) {
    return (
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
          Total: {props.pagination.total}
        </h4>
        <div className="h-[350px] max-w-full overflow-x-auto">
          <p className="my-5 text-center">조회된 데이터가 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Total: {props.pagination.total}
      </h4>
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
          // eslint-disable-next-line react/no-array-index-key
          <tr key={`pagination-tbody-tr-${index}`}>
            {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
            {row.map(([_, data]) => (
              <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark xl:pl-11">
                <p className="text-black dark:text-white">{data}</p>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
