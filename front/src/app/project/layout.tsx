import { PropsWithChildren } from "react";

export default function ProjectLayout(props: PropsWithChildren) {
  return (
    <div className="relative min-h-screen bg-gradient-to-tl from-zinc-900 via-zinc-400/10 to-zinc-900">
      {props.children}
    </div>
  );
}
