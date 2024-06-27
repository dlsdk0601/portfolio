"use client";

import { useRef } from "react";
import Link from "next/link";
import classNames from "classnames";
import { useClickOutside } from "../../hooks/useClickOutside";
import { managerModel } from "../../store/managerModel";
import { Urls } from "../../url/url.g";
import { SettingIcon, SignOutIcon } from "../icons";

const DropDownUserView = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { isOpen, setIsOpen } = useClickOutside(ref);
  const manager = managerModel((state) => state);

  return (
    <div className="relative" ref={ref}>
      <button type="button" className="flex items-center gap-4" onClick={() => setIsOpen(!isOpen)}>
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            {manager.name}
          </span>
          <span className="block text-xs">{manager.job}</span>
        </span>
        <svg
          className="hidden fill-current sm:block"
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
            fill=""
          />
        </svg>
      </button>

      <div
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        className={classNames(
          "absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark",
          {
            block: isOpen,
            hidden: !isOpen,
          },
        )}
      >
        <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
          <li>
            <Link
              href={Urls.profile.page.url()}
              className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              onClick={() => setIsOpen(false)}
            >
              <SettingIcon />
              Account Settings
            </Link>
          </li>
        </ul>
        <button
          type="button"
          className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
          onClick={() => manager.signOut()}
        >
          <SignOutIcon />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default DropDownUserView;
