import { PropsWithChildren } from "react";

export default function ProjectLayout(props: PropsWithChildren) {
  return (
    <div className="via-zincx-400/10 to-zionc-900 relative min-h-screen bg-gradient-to-tl from-zinc-900">
      {props.children}
    </div>
  );
}
