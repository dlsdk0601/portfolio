import React from "react";
import { ArrowLeft, Eye } from "lucide-react";
import Link from "next/link";
import { Urls } from "../../url/url.g";

const ProjectShowSkeletonView = () => {
  return (
    <>
      <header className="relative isolate overflow-hidden bg-gradient-to-tl from-black via-zinc-900 to-black">
        <div className="fixed inset-x-0 top-0 z-50 border-b border-transparent bg-zinc-900/0 backdrop-blur duration-200 lg:bg-transparent lg:backdrop-blur-none">
          <div className="container mx-auto flex flex-row-reverse items-center justify-between p-6">
            <div className="flex justify-between gap-8">
              <span
                title="View counter for this page"
                className="flex items-center gap-1 text-zinc-400 duration-200 hover:font-medium hover:text-zinc-100"
              >
                <Eye className="h-5 w-5" />
              </span>
            </div>
            <Link
              href={Urls.project.page.url()}
              className="text-zinc-400 duration-200 hover:font-medium hover:text-zinc-100"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
          </div>
        </div>
        <div className="container relative isolate mx-auto overflow-hidden py-24 sm:py-32">
          <div className="mx-auto flex max-w-7xl flex-col items-center px-6 text-center lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <div className="skeleton mx-auto mb-3 h-14 w-48 rounded bg-zinc-700" />
              <div className="skeleton mx-auto mb-3 h-8 w-96 rounded bg-white" />
              <div className="skeleton mx-auto mb-3 h-8 w-96 rounded bg-zinc-700" />
            </div>

            <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base font-semibold leading-7 text-white sm:grid-cols-2 md:flex lg:gap-x-10">
                <div className="skeleton h-8 w-36" />
              </div>
            </div>
          </div>
        </div>
      </header>
      <article className="skeleton prose prose-zinc prose-quoteless mx-auto my-12 h-screen bg-zinc-700" />
    </>
  );
};

export default ProjectShowSkeletonView;
