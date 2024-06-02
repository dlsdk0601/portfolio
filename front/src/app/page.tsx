import Link from "next/link";
import ParticlesView from "../view/particlesView";

export default function Home() {
  return (
    <div className="itmes-center flex h-screen w-screen flex-col justify-center overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black">
      <nav className="animate-fade-in my-16">
        <ul className="flex items-center justify-center gap-4">
          <li>
            <Link href="/" className="text-sm text-zinc-500 duration-500 hover:text-zinc-300">
              Projects
            </Link>
          </li>
          <li>
            <Link href="/" className="text-sm text-zinc-500 duration-500 hover:text-zinc-300">
              Contact
            </Link>
          </li>
        </ul>
      </nav>
      <div className="animate-glow animate-fade-left hidden h-px w-screen bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0 md:block" />
      <ParticlesView className="animate-fade-in absolute inset-0 -z-10" quantity={100} />

      <h1 className="text-edge-outline animate-title font-display z-10 cursor-default whitespace-nowrap bg-white bg-clip-text text-center text-4xl text-transparent duration-1000 sm:text-6xl md:text-9xl">
        portfolio
      </h1>

      <div className="animate-glow animate-fade-left hidden h-px w-screen bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0 md:block" />
      <div className="animate-fade-in my-16 text-center">
        <h2 className="text-sm text-zinc-500">
          {/* TODO :: href 수정 */}
          I&lsquo;m building{" "}
          <Link
            target="_blank"
            href="https://naver.com"
            className="hover:text0zinc-300 underline duration-500"
          >
            ina.jung@coint.co.kr
          </Link>{" "}
          to solve API autehntication and authorization for developers.
        </h2>
      </div>
    </div>
  );
}
