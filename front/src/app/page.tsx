import Link from "next/link";
import ParticlesView from "../view/ParticlesView";
import { Urls } from "../url/url.g";

export default function Home() {
  return (
    <div className="itmes-center flex h-screen w-screen flex-col justify-center overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black">
      <nav className="my-16 animate-fade-in">
        <ul className="flex items-center justify-center gap-4">
          <li>
            <Link
              href={Urls.project.page.url()}
              className="text-sm text-zinc-500 duration-500 hover:text-zinc-300"
            >
              Projects
            </Link>
          </li>
          <li>
            <Link
              href={Urls.contact.page.url()}
              className="text-sm text-zinc-500 duration-500 hover:text-zinc-300"
            >
              Contact
            </Link>
          </li>
        </ul>
      </nav>
      <div className="animate-glow hidden h-px w-screen animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0 md:block" />
      <ParticlesView className="absolute inset-0 -z-10 animate-fade-in" quantity={100} />

      <h1 className="text-edge-outline z-10 animate-title cursor-default whitespace-nowrap bg-white bg-clip-text text-center font-display text-4xl text-transparent duration-1000 sm:text-6xl md:text-9xl">
        portfolio
      </h1>

      <div className="animate-glow hidden h-px w-screen animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0 md:block" />
      <div className="my-16 animate-fade-in text-center">
        <h2 className="text-sm text-zinc-500">I&lsquo;m a FullStack developer who likes coding.</h2>
      </div>
    </div>
  );
}
