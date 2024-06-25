import React, { PropsWithChildren } from "react";

const Layout = (props: PropsWithChildren) => {
  return (
    <div className="flex h-screen flex-wrap items-center justify-center">
      <div className="w-3/4 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:w-1/3">
        <div className="w-full p-3 sm:p-12.5 xl:p-17.5">
          <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
            Sign In to Portfolio Admin
          </h2>

          {props.children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
