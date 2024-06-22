"use client";

import React from "react";
import Link from "next/link";
import useValueField from "../../hooks/useValueField";
import { vRequired } from "../../ex/validate";
import { EmailIcon, LockIcon } from "../../styles/icons";

const Page = () => {
  const [id, setId] = useValueField<string>("", "ID", vRequired);
  const [password, setPassword] = useValueField<string>("", "PASSWORD");

  return (
    <form>
      <div className="mb-4">
        <label className="mb-2.5 block font-medium text-black dark:text-white">{id.name}</label>
        <div className="relative">
          <input
            type="text"
            placeholder="Enter your id"
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            value={id.value}
            onChange={(e) => setId.set(e.target.value)}
          />

          <EmailIcon />
        </div>
      </div>

      <div className="mb-6">
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          {password.name}
        </label>
        <div className="relative">
          <input
            type="password"
            placeholder="Enter yout password"
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-white outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            value={password.value}
            onChange={(e) => setPassword.set(e.target.value)}
          />

          <LockIcon />
        </div>
      </div>

      <div className="mb-5">
        <input
          type="submit"
          value="Sign In"
          className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
        />
      </div>

      <div className="mt-6 text-center">
        <p>
          Don’t have any account?{" "}
          <Link href="mailto:inajung7008@gmail.com" className="text-primary">
            Send to email
          </Link>
        </p>
      </div>
    </form>
  );
};

export default Page;
