import { sleep } from "sleepjs";
import { config } from "../config/config"; // TODO :: icon 은 DB 에서 정의 할 것.

// TODO :: icon 은 DB 에서 정의 할 것.
export type CONTACT_ICON = "INSTAGRAM" | "GITHUB" | "MAIL";
export type ContactListResItem = {
  icon: CONTACT_ICON;
  label: string;
  href: string;
  handle: string;
};

export async function contactList() {
  // TODO :: API 통신
  await sleep(config.apiDelay);
  const res: ContactListResItem[] = [
    {
      icon: "INSTAGRAM",
      label: "Instagram",
      href: "https://instagram.com/jungin.__.a",
      handle: "jungin.__.a",
    },
    {
      icon: "GITHUB",
      label: "Github",
      href: "https://github.com/dlsdk0601",
      handle: "dlsdk0601",
    },
    {
      icon: "MAIL",
      label: "Email",
      href: "mailto:inajung7008@gmail.com",
      handle: "inajung7008@gmail.com",
    },
  ];

  return res;
}
