"use client";

import React, { MouseEvent, PropsWithChildren } from "react";
import { motion, useMotionTemplate, useSpring } from "framer-motion";
import { isNil } from "lodash";
import Link from "next/link";
import { Eye } from "lucide-react";
import { ProjectListResItem } from "../../api/schema.g";
import { Urls } from "../../url/url.g";
import { d4 } from "../../ex/dateEx";

export const DefaultCardView = (props: PropsWithChildren) => {
  const mouseX = useSpring(0, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(0, { stiffness: 500, damping: 100 });
  const maskImage = useMotionTemplate`radial-gradient(240px at ${mouseX}px ${mouseY}px, white, transparent`;
  const style = { maskImage, WebkitMaskImage: maskImage };

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isNil(e.currentTarget)) {
      return;
    }

    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  return (
    <div
      onMouseMove={onMouseMove}
      className="group relative overflow-hidden rounded-xl border border-zinc-600 duration-700 hover:border-zinc-400/50 hover:bg-zinc-800/10 md:gap-8"
    >
      <div className="pointer-events-none">
        <div className="absolute inset-0 z-0 transition duration-1000 [mask-image:linear-gradient(black,transparent)]" />
        <motion.div
          className="absolute inset-0 z-10 bg-gradient-to-br via-zinc-100/10 opacity-100 transition duration-1000 group-hover:opacity-50"
          style={style}
        />
        <motion.div
          className="absolute inset-0 z-10 opacity-0 mix-blend-overlay transition duration-1000 group-hover:opacity-100"
          style={style}
        />
      </div>

      {props.children}
    </div>
  );
};

export const ArticleView = (props: { project: ProjectListResItem }) => {
  return (
    <Link href={Urls.project["[pk]"].page.url({ pk: props.project.pk })}>
      <article className="p-4 md:p-8">
        <div className="flex items-center justify-between gap-2">
          <span className="drop-shadow-orange text-xs text-zinc-200 duration-1000 group-hover:border-zinc-200 group-hover:text-white">
            <time>{d4(props.project.issueAt)}</time>
          </span>
          <span className="flex items-center gap-1 text-xs text-zinc-500">
            <Eye className="h-4 w-4" />{" "}
            {Intl.NumberFormat("en-US", { notation: "compact" }).format(props.project.viewCount)}
          </span>
        </div>
        <h2 className="z-20 font-display text-xl font-medium text-zinc-200 duration-1000 group-hover:text-white lg:text-3xl">
          {props.project.title}
        </h2>
        <p className="z-20 mt-4 text-sm text-zinc-400 duration-1000 group-hover:text-zinc-200">
          {props.project.description}
        </p>
      </article>
    </Link>
  );
};

export const CardArticleView = (props: { project: ProjectListResItem }) => {
  return (
    <DefaultCardView>
      <ArticleView project={props.project} />
    </DefaultCardView>
  );
};
