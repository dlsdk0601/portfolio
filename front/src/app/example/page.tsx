import React from "react";
import NavigationView from "../../view/contact/NavigationView";
import ContactSkeletonView from "../../view/skeleton/contactSkeletonView";

const Page = () => {
  return (
    <div className="bg-gradient-to-tl from-zinc-900/0 via-zinc-900 to-zinc-900/0">
      <NavigationView />
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
        <ContactSkeletonView />
      </div>
    </div>
  );
};

export default Page;
