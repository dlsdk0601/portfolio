import { Suspense } from "react";
import NavigationView from "../../view/contact/NavigationView";
import ContactListView from "../../view/contact/ContactList.view";

const ContactPage = () => {
  // TODO :: 컴포넌트화 해서 suspense 감싸기 및 로딩 처리
  // https://nextjs.org/docs/app/building-your-application/data-fetching/patterns#sequential-data-fetching

  return (
    <div className="bg-gradient-to-tl from-zinc-900/0 via-zinc-900 to-zinc-900/0">
      <NavigationView />
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
        <div className="mx-auto mt-32 grid w-full grid-cols-1 gap-8 sm:mt-0 sm:grid-cols-3 lg:gap-16">
          <Suspense fallback={<div>Loading...</div>}>
            <ContactListView />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
