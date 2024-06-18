"use client";

import React from "react";
import { blockModel } from "../store/blockModel";

const BlockView = () => {
  const isLock = blockModel((state) => state.isLock);

  if (!isLock) {
    return <></>;
  }

  return (
    <div className="dark:bg-boxdart-2 dark:text-bodydark">
      <div className="flex h-screen items-center justify-center bg-white dark:bg-black">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent" />
      </div>
    </div>
  );
};

export default BlockView;
