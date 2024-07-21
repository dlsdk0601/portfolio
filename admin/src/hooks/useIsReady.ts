"use client";

import { DependencyList, useEffect } from "react";
import { useRouter } from "next/router";

/**
 * useIsReady
 * next.js useDidMount 대체
 * @param func: mount 되고 실행 될 콜백
 * @param deps: DependencyList
 */

const useIsReady = (func: () => void, deps: DependencyList = []) => {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      func();
    }
  }, [...deps, router, func]);
};

export default useIsReady;
