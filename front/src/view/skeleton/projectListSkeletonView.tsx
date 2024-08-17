"use client";

import React, { useEffect } from "react";
import { motion, useAnimationControls, useMotionTemplate, useSpring } from "framer-motion";
import { range } from "lodash";

const ProjectListSkeletonView = () => {
  return (
    <>
      <div className="mx-auto grid grid-cols-1 gap-8 lg:grid-cols-2">
        <CardArticleSkeletonView />

        <div className="mx-auto flex w-full flex-col gap-8 border-t border-gray-900/10 lg:mx-0 lg:border-t-0">
          {[1, 2].map((p) => (
            <CardArticleSkeletonView key={`project-list-skeleton-${p}`} />
          ))}
        </div>
      </div>
      <div className="hidden h-px w-full bg-zinc-800 md:block" />

      <div className="mx-auto grid grid-cols-1 gap-4 md:grid-cols-3 lg:mx-0">
        <div className="grid grid-cols-1 gap-4">
          {range(3, 10)
            .filter((_, i) => i % 3 === 0)
            .map((p) => (
              <CardArticleSkeletonView key={`project-list-skeleton-${p}`} />
            ))}
        </div>
        <div className="grid grid-cols-1 gap-4">
          {range(3, 10)
            .filter((_, i) => i % 3 === 1)
            .map((p) => (
              <CardArticleSkeletonView key={`project-list-skeleton-${p}`} />
            ))}
        </div>
        <div className="grid grid-cols-1 gap-4">
          {range(3, 10)
            .filter((_, i) => i % 3 === 2)
            .map((p) => (
              <CardArticleSkeletonView key={`project-list-skeleton-${p}`} />
            ))}
        </div>
      </div>
    </>
  );
};

const CardArticleSkeletonView = () => {
  const controls = useAnimationControls();
  const mouseX = useSpring(0, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(0, { stiffness: 500, damping: 100 });
  const maskImage = useMotionTemplate`radial-gradient(240px at ${mouseX}px ${mouseY}px, white, transparent)`;
  const style = { maskImage, WebkitMaskImage: maskImage };

  useEffect(() => {
    controls
      .start({
        opacity: [0, 1, 0],
        transition: { duration: 2, times: [0, 0.5, 1] },
      })
      .then(() => {});
  }, [controls]);

  return (
    <div className="group relative overflow-hidden rounded-xl border border-zinc-600 duration-700 hover:border-zinc-400/50 hover:bg-zinc-800/10 md:gap-8">
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
        <motion.div
          className="absolute inset-0 z-20 bg-gradient-to-r from-zinc-800/0 via-zinc-100/10 to-zinc-800/0"
          animate={controls}
        />
      </div>
      <article className="p-4 md:p-8">
        <div className="flex items-center justify-between gap-2">
          <div className="h-4 w-24 rounded bg-zinc-700" />
        </div>
        <div className="mt-4 h-8 w-3/4 rounded bg-zinc-700" />
        <p className="mt-4 h-4 w-full rounded bg-zinc-700" />
      </article>
    </div>
  );
};

export default ProjectListSkeletonView;
