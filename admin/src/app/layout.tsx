import { PropsWithChildren } from "react";
import type { Metadata } from "next";
import "../styles/globals.css";
import "../styles/satoshi.css";
import BlockView from "../view/blockView";
import { LayoutSelector } from "../view/layout/layoutSelector";

export const metadata: Metadata = {
  title: "admin",
  description: "portfolio admin for ina",
};

export default function RootLayout(props: PropsWithChildren) {
  return (
    <html lang="en">
      <body className="sidebar-expanded">
        <LayoutSelector>{props.children}</LayoutSelector>
        <BlockView />
      </body>
    </html>
  );
}
