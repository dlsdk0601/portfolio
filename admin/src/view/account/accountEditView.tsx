"use client";

import { isNil } from "lodash";
import { useCallback, useEffect, useState } from "react";
import TextFieldView from "../textFieldView";
import { EmailIcon, ProfileIcon } from "../icons";
import useValueField from "../../hooks/useValueField";
import { vEmail, vRequired } from "../../ex/validate";
import { Replace } from "../layout/layoutSelector";
import { Urls } from "../../url/url.g";
import { api } from "../../api/api";
import { ignorePromise, isNotNil } from "../../ex/utils";
import { ManagerShowRes } from "../../api/schema.g";
import { CheckBoxView } from "../checkBoxView";

export const AccountEditView = (props: { pk: number | null }) => {
  const pk = props.pk;

  if (isNil(pk)) {
    return <Replace url={Urls.account.page.url()} />;
  }

  const [manager, setManager] = useState<ManagerShowRes | null>(null);

  useEffect(() => {
    if (isNil(pk)) {
      return;
    }

    ignorePromise(() => init(pk));
  }, [pk]);

  const init = useCallback(async (pkValue: number) => {
    const res = await api.managerShow({ pk: pkValue });

    if (isNil(res)) {
      return;
    }

    setManager({ ...res });
  }, []);

  if (isNil(manager)) {
    return <></>;
  }

  return (
    <AccountFormEditView
      pk={manager.pk}
      id={manager.id}
      name={manager.name}
      email={manager.email}
      phone={manager.phone}
      job={manager.job}
      enable={manager.enable}
    />
  );
};

export const AccountFormEditView = (props: {
  pk: number;
  id: string;
  name: string;
  email: string;
  phone: string;
  job: string;
  enable: boolean | null;
}) => {
  const pk = props.pk;
  const [name, setName] = useValueField<string>("", "이름", vRequired);
  const [phone, setPhone] = useValueField<string>("", "휴대폰 번호", vRequired);
  const [email, setEmail] = useValueField<string>("", "이메일", vRequired, vEmail);
  const [id, setId] = useValueField<string>("", "ID", vRequired);
  const [job, setJob] = useValueField<string>("", "직업");
  const [enable, setEnable] = useValueField<boolean>(false, "상태");

  useEffect(() => {
    setName.set(props.name);
    setPhone.set(props.phone);
    setEmail.set(props.email);
    setId.set(props.id);
    setJob.set(props.job);

    if (isNotNil(props.enable)) {
      setEnable.set(props.enable);
    }
  }, [props]);

  const onSubmit = useCallback(async () => {
    console.log(pk);
  }, [pk]);

  return (
    <form>
      <CheckBoxView field={enable} onChange={(checked) => setEnable.set(checked)} col={2} />

      <div className="flex flex-col gap-5.5 sm:flex-row">
        <TextFieldView
          field={name}
          onChange={(value) => setName.set(value)}
          icon={<ProfileIcon />}
          col={2}
        />
        <TextFieldView field={phone} onChange={(value) => setPhone.set(value)} col={2} />
      </div>

      <TextFieldView field={email} onChange={(value) => setEmail.set(value)} icon={<EmailIcon />} />

      <TextFieldView field={id} onChange={(value) => setId.set(value)} />

      <TextFieldView field={job} onChange={(value) => setJob.set(value)} />

      <div className="flex justify-end gap-4.5">
        <button
          type="submit"
          className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
        >
          Save
        </button>
      </div>
    </form>
  );
};
