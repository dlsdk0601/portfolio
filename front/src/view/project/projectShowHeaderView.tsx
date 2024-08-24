"use client";

import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { ArrowLeft, Eye } from "lucide-react";
import Link from "next/link";
import { isNotBlank } from "../../ex/utils";
import { Urls } from "../../url/url.g";

const ProjectShowHeaderView = (props: {
  title: string;
  description: string;
  githubSite: string;
  websiteUrl: string;
  views: number;
}) => {
  const ref = useRef<HTMLElement>(null);
  const [isIntersecting, setIntersecting] = useState(true);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) =>
      setIntersecting(entry?.isIntersecting ?? false),
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      ref={ref}
      className="relative isolate overflow-hidden bg-gradient-to-tl from-black via-zinc-900 to-black"
    >
      <div
        className={classNames(
          "fixed inset-x-0 top-0 z-50 border-b backdrop-blur duration-200 lg:bg-transparent lg:backdrop-blur-none",
          {
            "border-transparent bg-zinc-900/0": isIntersecting,
            "border-zinc-200 bg-white/10 lg:border-transparent": !isIntersecting,
          },
        )}
      >
        <div className="container mx-auto flex flex-row-reverse items-center justify-between p-6">
          <div className="flex justify-between gap-8">
            <span
              title="View counter for this page"
              className={classNames("flex items-center gap-1 duration-200 hover:font-medium", {
                "text-zinc-400 hover:text-zinc-100": isIntersecting,
                "text-zinc-600 hover:text-zinc-900": !isIntersecting,
              })}
            >
              <Eye className="h-5 w-5" />{" "}
              {Intl.NumberFormat("en-US", { notation: "compact" }).format(props.views)}
            </span>
          </div>
          <Link
            href={Urls.project.page.url()}
            className={classNames("duration-200 hover:font-medium", {
              "text-zinc-400 hover:text-zinc-100": isIntersecting,
              "text-zinc-600 hover:text-zinc-900": !isIntersecting,
            })}
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
        </div>
      </div>
      <div className="container relative isolate mx-auto overflow-hidden py-24 sm:py-32">
        <div className="mx-auto flex max-w-7xl flex-col items-center px-6 text-center lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-6xl">
              {props.title}
            </h1>
            <p className="mt-6 whitespace-pre-line text-lg leading-8 text-zinc-300">
              {props.description}
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base font-semibold leading-7 text-white sm:grid-cols-2 md:flex lg:gap-x-10">
              {isNotBlank(props.githubSite) && (
                <Link target="_blank" href={props.githubSite}>
                  GitHub <span aria-hidden="true">&rarr;</span>
                </Link>
              )}
              {isNotBlank(props.websiteUrl) && (
                <Link target="_blank" href={props.websiteUrl}>
                  Website <span aria-hidden="true">&rarr;</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ProjectShowHeaderView;
