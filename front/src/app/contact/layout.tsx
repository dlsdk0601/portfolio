import { PropsWithChildren } from "react";
import NavigationView from "../../view/contact/NavigationView";

export default function Layout(props: PropsWithChildren) {
  return (
    <div className="bg-gradient-to-tl from-zinc-900/0 via-zinc-900 to-zinc-900/0">
      <NavigationView />
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
        {props.children}
      </div>
    </div>
  );
}
