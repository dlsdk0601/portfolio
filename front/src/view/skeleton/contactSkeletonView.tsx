import React from "react";
import CardView from "../contact/CardView";

const ContactSkeletonView = () => {
  return (
    <div className="mx-auto mt-32 grid w-full grid-cols-1 gap-8 sm:mt-0 sm:grid-cols-3 lg:gap-16">
      {[1, 2, 3].map((item) => (
        <CardView key={`contact-skeleton-${item}`}>
          <div className="relative flex animate-pulse flex-col items-center gap-4 p-4 md:gap-8 md:p-16 md:py-24 lg:pb-48">
            <span
              className="absolute h-2/3 w-px bg-gradient-to-b from-zinc-500 via-zinc-500/50 to-transparent"
              aria-hidden="true"
            />
            <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-500 bg-zinc-800" />
            <div className="z-10 flex flex-col items-center">
              <span className="h-6 w-24 rounded bg-zinc-700 font-display font-medium text-zinc-300" />
              <span className="mt-4 h-4 w-32 rounded bg-zinc-600" />
            </div>
          </div>
        </CardView>
      ))}
    </div>
  );
};

export default ContactSkeletonView;
