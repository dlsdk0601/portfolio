"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Urls } from "../url/url.g";

const ErrorPage = (props: { error: Error; reset: () => void }) => {
  console.error(props.error);
  const router = useRouter();

  let onClick = () => props.reset();

  switch (props.error.cause) {
    case "LOGIN_REQUIRED":
    case "NO_PERMISSION":
    case "INVALID_ACCESS_TOKEN": {
      // 사실 로그인 페이지로 보내는게 맞지만, public 사이트는 불필요
      onClick = () => router.push(Urls.page.url());
      break;
    }
    default: {
      onClick = () => props.reset();
      break;
    }
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-tl from-zinc-900/0 via-zinc-900 to-zinc-900/0">
      <span className="mb-8 text-center text-xl text-zinc-400 duration-1000 group-hover:text-zinc-200">
        {props.error.message ?? "예상치 못한 에러가 발생했습니다."}
      </span>
      <button
        type="button"
        className="mb-3 rounded-2xl border-2 border-zinc-400 px-8 py-4 text-zinc-400 duration-700 hover:border-zinc-200 hover:text-zinc-200"
        onClick={() => onClick()}
      >
        새로 고침
      </button>
      <button
        type="button"
        className="rounded-2xl border-2 border-zinc-400 p-4 text-zinc-400 duration-700 hover:border-zinc-200 hover:text-zinc-200"
        onClick={() => router.push(Urls.page.url())}
      >
        HOME 으로 돌아가기
      </button>
    </div>
  );
};

export default ErrorPage;
