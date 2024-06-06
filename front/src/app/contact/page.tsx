import ContactListView from "../../view/contact/ContactList.view";

const ContactPage = async () => {
  // TODO :: 컴포넌트화 해서 suspense 감싸기 및 로딩 처리
  // https://nextjs.org/docs/app/building-your-application/data-fetching/patterns#sequential-data-fetching

  return (
    <div className="mx-auto mt-32 grid w-full grid-cols-1 gap-8 sm:mt-0 sm:grid-cols-3 lg:gap-16">
      <ContactListView />
    </div>
  );
};

export default ContactPage;
