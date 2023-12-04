import React, { PropsWithChildren } from "react";
import { ClipLoader } from "react-spinners";
import { Inter } from "next/font/google";
import {
  QueryClient,
  QueryClientProvider,
  useIsFetching,
  useIsMutating,
} from "react-query";
import { useRouter } from "next/router";
import { RecoilRoot } from "recoil";
import { some } from "lodash";
import Head from "next/head";
import type { Metadata } from "next";
import "./globals.css";
import Favicon from "./favicon.ico";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        onError: () => router.replace("/_error"),
        staleTime: 600000, // 10 min
        cacheTime: 300000, // 5 min
      },
      mutations: {
        onError: () => router.replace("/_error"),
      },
    },
  });
  return (
    <html lang="en">
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <LayoutSelector>
            <body className={inter.className}>{children}</body>
          </LayoutSelector>
        </QueryClientProvider>
      </RecoilRoot>
    </html>
  );
}

const LayoutSelector = (props: PropsWithChildren) => {
  const router = useRouter();

  // 예외 URL
  const isSpecialUrl = some(["/_"], (prefix) =>
    router.pathname.startsWith(prefix),
  );

  if (isSpecialUrl) {
    return <>{props.children}</>;
  }

  // 로그인
  if (router.pathname.startsWith("/sign-in")) {
    return <DefaultLayoutView>{props.children}</DefaultLayoutView>;
  }

  return <UserApp>{props.children}</UserApp>;
};

// 로그인 판단 단계
const UserApp = (props: PropsWithChildren) => {
  const router = useRouter();
  // const token = sessionStorage.getItem(CONSTANT.sessionTokenKey) ?? null;
  // const setToken = useSetRecoilState(accessToken);

  // useEffect(() => {
  //   setToken(token);
  // }, []);

  if (!router.isReady) {
    return <DefaultLayoutView>{props.children}</DefaultLayoutView>;
  }

  // 로그인 전
  // if (isNil(token)) {
  //   return <Replace url={Urls.auth["sign-in"].url({ returnTo: router.asPath })} />;
  // }
};

// 비로그인 유저가 보는 화면 (ex 어드민에서 로그인 화면)
const DefaultLayoutView = (props: PropsWithChildren) => {
  // noinspection HtmlRequiredTitleElement
  return (
    <>
      <Head>
        <link rel="shortcut icon" type="image/x-icon" href={Favicon.src} />
      </Head>
      {props.children}
      <BlockView />
    </>
  );
};

const BlockView = () => {
  const postLoadingCount = useIsMutating();
  const getLoadingCount = useIsFetching();
  const isLocked = getLoadingCount + postLoadingCount > 0;
  // const isLoad = useRecoilValue(isGlobalLoading);
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        pointerEvents: isLocked ? "auto" : "none",
        opacity: isLocked ? 1 : 0,
        transition: "opacity .3s .1s",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ClipLoader />
    </div>
  );
};
