import React, { PropsWithChildren } from "react";
import LeftSidebarView from "../../view/layout/leftSidebarView";
import { HeaderView } from "../../view/layout/HeaderView";

const Layout = (props: PropsWithChildren) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <LeftSidebarView />
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <HeaderView />
        <main>
          <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">{props.children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
