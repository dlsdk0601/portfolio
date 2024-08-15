"use client";

import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Urls } from "../../url/url.g";

const NavigationView = () => {
  const ref = useRef<HTMLElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(true);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) =>
      setIsIntersecting(entry?.isIntersecting ?? false),
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <header ref={ref}>
      <div
        className={classNames("fixed inset-x-0 top-0 z-50 border-b backdrop-blur duration-200", {
          "border-transparent bg-zinc-900/0": isIntersecting,
          "bg-zinc-900/500 border-zinc-800": !isIntersecting,
        })}
      >
        <div className="items center container mx-auto flex flex-row-reverse justify-between p-6">
          <div className="flex justify-between gap-8">
            <Link
              href={Urls.project.page.url()}
              className="text-zinc-400 duration-200 hover:text-zinc-100"
            >
              Projects
            </Link>
            <Link
              href={Urls.contact.page.url()}
              className="text-zinc-400 duration-200 hover:text-zinc-100"
            >
              Contact
            </Link>
          </div>

          <Link href={Urls.page.url()} className="text-zinc-300 duration-200 hover:text-zinc-100">
            <ArrowLeft className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default NavigationView;
