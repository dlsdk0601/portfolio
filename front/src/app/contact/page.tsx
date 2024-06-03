import { Github, Instagram, Mail } from "lucide-react";
import Link from "next/link";
import NavigationView from "../../view/contact/NavigationView";
import CardView from "../../view/contact/CardView";
import { CONTACT_ICON, contactList } from "../../action/contact"; // const socials = [

const ContactPage = async () => {
  // TODO :: 컴포넌트화 해서 suspense 감싸기 및 로딩 처리
  // https://nextjs.org/docs/app/building-your-application/data-fetching/patterns#sequential-data-fetching
  const socials = await contactList();

  return (
    <div className="bg-gradient-to-tl from-zinc-900/0 via-zinc-900 to-zinc-900/0">
      <NavigationView />
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
        <div className="mx-auto mt-32 grid w-full grid-cols-1 gap-8 sm:mt-0 sm:grid-cols-3 lg:gap-16">
          {socials.map((social) => (
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
                <span className="text zinc-200 drop-shadow-orange relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-500 bg-zinc-900 text-sm duration-1000 group-hover:border-zinc-200 group-hover:bg-zinc-900 group-hover:text-white">
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
        </div>
      </div>
    </div>
  );
};

const ContactIConView = (props: { icon: CONTACT_ICON }) => {
  switch (props.icon) {
    case "MAIL":
      return <Mail size={20} />;
    case "GITHUB":
      return <Github size={20} />;
    case "INSTAGRAM":
    default:
      return <Instagram size={20} />;
  }
};

export default ContactPage;
