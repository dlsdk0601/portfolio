import React, { PropsWithChildren } from "react";
import { LayoutView } from "../../view/layout/layoutView";

const Layout = (props: PropsWithChildren) => {
  return <LayoutView>{props.children}</LayoutView>;
};

export default Layout;
