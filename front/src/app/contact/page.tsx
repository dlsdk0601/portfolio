import Link from "next/link";
import { contactList } from "../../action/contact";
import CardView from "../../view/contact/CardView";
import ContactIConView from "../../view/contact/ContactIconView";

// https://nextjs.org/docs/app/building-your-application/data-fetching/patterns#sequential-data-fetching
// props 를 받아서 fetch 해야하는 경우에 suspense 사용

const ContactPage = async () => {
  const res = await contactList();

  return (
    <div className="mx-auto mt-32 grid w-full grid-cols-1 gap-8 sm:mt-0 sm:grid-cols-3 lg:gap-16">
      {res.contacts.map((social) => (
        <CardView key={`contact-social-${social.type}`}>
          <Link
            href={social.href}
            target="_blank"
            className="group relative flex flex-col items-center gap-4 p-4 duration-700 md:gap-8 md:p-16 md:py-24 lg:pb-48"
          >
            <span
              className="absolute h-2/3 w-px bg-gradient-to-b from-zinc-500 via-zinc-500/50 to-transparent"
              aria-hidden="true"
            />
            <span className="drop-shadow-orange relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-500 bg-zinc-900 text-sm text-zinc-200 duration-1000 group-hover:border-zinc-200 group-hover:bg-zinc-900 group-hover:text-white">
              <ContactIConView icon={social.type} />
            </span>{" "}
            <div className="z-10 flex flex-col items-center">
              <span className="group-hover:text-whte font-display font-medium text-zinc-200 duration-150 lg:text-xl xl:text-3xl">
                {social.type}
              </span>
              <span className="mt-4 text-center text-sm text-zinc-400 duration-1000 group-hover:text-zinc-200">
                {social.id}
              </span>
            </div>
          </Link>
        </CardView>
      ))}
    </div>
  );
};

export default ContactPage;
