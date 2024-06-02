"use client";

import { GoogleTagManager } from "@next/third-parties/google";
import { config } from "../config/config";

const Analytics = () => {
  return <GoogleTagManager gtmId={config.googleGtmId} />;
};

export default Analytics;
