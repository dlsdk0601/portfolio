"use client";

import React from "react";
import { isBlock } from "../store/isBlock";

const BlockView = () => {
  const isLock = isBlock((state) => state.isLock());

  if (!isLock) {
    return <></>;
  }

  return (
    <div className="dark:bg-boxdart-2 dark:text-bodydark">
      <div className="flex h-screen items-center justify-center bg-white dark:bg-black">
        <div className="border-primary h-16 w-16 animate-spin rounded-full border-4 border-solid border-t-transparent" />
      </div>
    </div>
  );
};

export default BlockView;
