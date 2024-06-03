import "./globals.css";
import React from "react";
import classNames from "classnames";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import Analytics from "../view/Analytics";

export const metadata: Metadata = {
  title: {
    default: "void",
    template: "void | %s",
  },
  description: "개발자 정인아의 포트폴리오 사이트입니다.",
  openGraph: {
    title: "ina.portfolio.com",
    description: "개발자 정인아의 포트폴리오 사이트입니다.",
    url: "https://ina.portfolio.com",
    siteName: "ina-portfolio",
    images: [
      {
        url: "https://ina.portfolio.com/og.png",
        width: 1920,
        height: 1080,
      },
    ],
    locale: "ko-KR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      "index": true,
      "follow": true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    shortcut: "/favicon.png",
  },
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const calSans = localFont({
  src: "../../public/fonts/CalSans-SemiBold.ttf",
  variable: "--font-calsans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={[inter.variable, calSans.variable].join(" ")}>
      <Analytics />
      <body
        className={classNames("bg-black", {
          "debug-screens": process.env.NODE_ENV === "development",
        })}
      >
        {children}
      </body>
    </html>
  );
}
