import React from "react";
import Link from "next/link";
import { Urls } from "../url/url.g";

const NotFound = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-tl from-zinc-900/0 via-zinc-900 to-zinc-900/0">
      <span className="mb-8 text-center text-xl text-zinc-400 duration-1000 group-hover:text-zinc-200">
        데이터가 조회되지 않습니다.
      </span>
      <Link
        href={Urls.page.url()}
        className="rounded-2xl border-2 border-zinc-400 p-4 text-zinc-400 duration-700 hover:border-zinc-200 hover:text-zinc-200"
      >
        HOME 으로 돌아가기
      </Link>
    </div>
  );
};

export default NotFound;
