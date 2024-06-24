"use client";

import React from "react";
import { HashLoader } from "react-spinners";
import { blockModel } from "../store/blockModel";

const BlockView = () => {
  const isLock = blockModel((state) => state.isLock);

  if (!isLock) {
    return <></>;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        pointerEvents: isLock ? "auto" : "none",
        opacity: isLock ? 1 : 0,
        transition: "opacity 300ms 100ms",
      }}
      className="flex items-center justify-center bg-[rgba(0,0,0,0.7)]"
    >
      <HashLoader />
    </div>
  );
};

export default BlockView;
