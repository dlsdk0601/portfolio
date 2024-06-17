"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

function LayoutSelector() {
  const path = usePathname();

  // 예외 URL
  const isSpecialUrl = ["/_"].some((prefix) => path.startsWith(prefix));

  if (isSpecialUrl) {
    return <></>;
  }

  // 로그인
  if (path.startsWith("/sign/")) {
    return <></>;
  }

  return <></>;
}

export function Replace(props: { url: string }) {
  const router = useRouter();
  useEffect(() => {
    router.replace(props.url);
  }, [props.url]);
  return <></>;
}
