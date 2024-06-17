import React, { PropsWithChildren } from "react";
import LeftSidebarView from "./leftSidebarView";
import { DarkModeSwitcher, LeftSidebarButtonView } from "./headerButtonView";

export const LayoutView = (props: PropsWithChildren) => {
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

const HeaderView = () => {
  return (
    <header className="z-999 drop-shadow-1 dark:bg-boxdark sticky top-0 flex w-full bg-white dark:drop-shadow-none">
      <div className="shadow-2 flex flex-grow items-center justify-between px-4 py-4 md:px-6 2xl:px-11">
        <LeftSidebarButtonView />
        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            <DarkModeSwitcher />
            {/* <DropdownUser /> */}
          </ul>
        </div>
      </div>
    </header>
  );
};
