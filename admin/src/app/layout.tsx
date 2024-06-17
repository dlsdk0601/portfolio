import { PropsWithChildren } from "react";
import type { Metadata } from "next";
import "../styles/globals.css";
import BlockView from "../view/blockView";
import { LayoutView } from "../view/layout/layoutView";

export const metadata: Metadata = {
  title: "admin",
  description: "portfolio admin for ina",
};

export default function RootLayout(props: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <BlockView />
        <LayoutView>{props.children}</LayoutView>
      </body>
    </html>
  );
}
