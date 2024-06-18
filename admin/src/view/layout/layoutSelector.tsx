"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { managerModel } from "../../store/managerModel";
import { Urls } from "../../url/url.g";

export function LayoutSelector() {
  const path = usePathname();

  // 예외 URL
  const isSpecialUrl = ["/_"].some((prefix) => path.startsWith(prefix));

  if (isSpecialUrl) {
    // OPT :: 예외 URL 이 추가 된다면 Replace 시킬 것.
    return <></>;
  }

  if (path === Urls["sign-in"].page.url()) {
    return <></>;
  }

  return <AdminApp />;
}

export function AdminApp() {
  const manager = managerModel((state) => state);
  const path = usePathname();

  useEffect(() => {
    if (manager.isSigned) {
      return;
    }

    manager.init();
  }, []);

  // 계정 정보 초기화 중
  if (!manager.initialized) {
    return <></>;
  }

  if (!manager.isSigned) {
    // 로그인 전 이라면 로그인 페이지로
    return <Replace url={Urls["sign-in"].page.url({ returnTo: path })} />;
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