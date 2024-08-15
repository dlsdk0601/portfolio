import { PropsWithChildren } from "react";
import NavigationView from "../../view/contact/NavigationView";

export default function ProjectLayout(props: PropsWithChildren) {
  return (
    <div className="relative min-h-screen bg-gradient-to-tl from-zinc-900 via-zinc-400/10 to-zinc-900">
      <div className="relative pb-16">
        <NavigationView />
        <div className="mx-auto max-w-7xl space-y-8 px-6 pt-20 md:space-y-16 md:pt-24 lg:px-8 lg:pt-32">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
              Projects
            </h2>
            <p className="mt-4 text-zinc-400">
              Some of the projects are from work and some are on my own time.
            </p>
          </div>
          <div className="h-px w-full bg-zinc-800" />
          {props.children}
        </div>
      </div>
    </div>
  );
}
