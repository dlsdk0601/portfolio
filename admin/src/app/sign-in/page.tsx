"use client";

import React, { FormEvent, useCallback, useEffect } from "react";
import Link from "next/link";
import { isNil } from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import { useStringField } from "../../hooks/useValueField";
import { vPassword, vRequired } from "../../ex/validate";
import { EmailIcon, LockIcon } from "../../view/icons";
import { Urls } from "../../url/url.g";
import { api } from "../../api/api";
import { managerModel } from "../../store/managerModel";
import TextFieldView from "../../view/textFieldView";

const Page = () => {
  const router = useRouter();
  const query = useSearchParams();
  const [token, setToken] = managerModel((state) => [state.token, state.setToken]);
  const [id, setId] = useStringField("ID", vRequired);
  const [password, setPassword] = useStringField("PASSWORD", vRequired, vPassword);

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (setId.validate()) {
        return;
      }

      if (setPassword.validate()) {
        return;
      }

      const res = await api.signIn({
        id: id.value,
        password: password.value,
      });

      if (isNil(res)) {
        return;
      }

      setToken(res.token, res.refreshToken);

      const returnTo = query.get("returnTo");
      if (isNil(returnTo)) {
        return router.replace(Urls.account.page.url());
      }

      return router.replace(returnTo);
    },
    [id.value, password.value],
  );

  useEffect(() => {
    if (isNil(token)) {
      return;
    }

    router.replace(Urls.account.page.url());
  }, [token]);

  return (
    <form onSubmit={(e) => onSubmit(e)}>
      <TextFieldView field={id} onChange={(value) => setId.set(value)} icon={<EmailIcon />} />
      <TextFieldView
        type="password"
        field={password}
        onChange={(value) => setPassword.set(value)}
        icon={<LockIcon />}
      />

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
