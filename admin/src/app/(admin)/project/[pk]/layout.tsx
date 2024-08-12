import { PropsWithChildren } from "react";

const Layout = (props: PropsWithChildren) => {
  return (
    <div className="mx-auto max-w-270">
      <div className="col-span-5 xl:col-span-3">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">프로젝트 정보</h3>
          </div>
          <div className="p-7">{props.children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
