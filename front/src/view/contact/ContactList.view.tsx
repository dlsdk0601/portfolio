import Link from "next/link";
import CardView from "./CardView";
import ContactIConView from "./ContactIconView";
import { contactList } from "../../action/contact";

const ContactListView = async () => {
  const contacts = await contactList();

  return (
    <>
      {contacts.map((social) => (
        <CardView key={`contact-social-${social.label}`}>
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
              <ContactIConView icon={social.icon} />
            </span>{" "}
            <div className="z-10 flex flex-col items-center">
              <span className="group-hover:text-whte font-display font-medium text-zinc-200 duration-150 lg:text-xl xl:text-3xl">
                {social.handle}
              </span>
              <span className="mt-4 text-center text-sm text-zinc-400 duration-1000 group-hover:text-zinc-200">
                {social.label}
              </span>
            </div>
          </Link>
        </CardView>
      ))}
    </>
  );
};

export default ContactListView;
