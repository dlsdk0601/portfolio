"use client";

import { isNil } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TextFieldView from "../textFieldView";
import { EmailIcon, ProfileIcon } from "../icons";
import useValueField from "../../hooks/useValueField";
import { validateFields, vEmail, vPassword, vPhone, vRequired } from "../../ex/validate";
import { Replace } from "../layout/layoutSelector";
import { Urls } from "../../url/url.g";
import { api } from "../../api/api";
import { ignorePromise, isNotBlank, preventDefaulted } from "../../ex/utils";
import { ManagerShowRes } from "../../api/schema.g";
import { CheckBoxView } from "../checkBoxView";
import { cPk, isNewPk } from "../../ex/query";

export const AccountEditView = (props: { pk: cPk | null; enter: "ACCOUNT" | "PROFILE" }) => {
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

  const init = useCallback(async (p: cPk) => {
    if (isNewPk(p)) {
      return;
    }

    const res = await api.managerShow({ pk: p });

    if (isNil(res)) {
      return;
    }

    setManager({ ...res });
  }, []);

  return <AccountFormEditView manager={manager} enter={props.enter} isShowEnable />;
};

export const AccountFormEditView = (props: {
  manager: ManagerShowRes | null;
  enter: "ACCOUNT" | "PROFILE";
  isShowEnable?: boolean;
}) => {
  const router = useRouter();

  const manager = props.manager;
  const [name, setName] = useValueField<string>("", "이름", vRequired);
  const [phone, setPhone] = useValueField<string>("", "휴대폰 번호", vPhone);
  const [email, setEmail] = useValueField<string>("", "이메일", vRequired, vEmail);
  const [id, setId] = useValueField<string>("", "ID", vRequired);
  const [password, setPassword] = useValueField<string>("", "PASSWORD", vPassword);
  const [job, setJob] = useValueField<string>("", "직업", vRequired);
  const [enable, setEnable] = useValueField<boolean>(true, "상태");

  useEffect(() => {
    if (isNil(manager)) {
      return;
    }

    setName.set(manager.name);
    setPhone.set(manager.phone);
    setEmail.set(manager.email);
    setId.set(manager.id);
    setJob.set(manager.job);
    setEnable.set(manager.enable);
  }, [manager]);

  const onSubmit = useCallback(async () => {
    const isValid = validateFields([setName, setPhone, setEmail, setId, setJob]);

    if (!isValid) {
      alert("데이터가 유효하지 않습니다.");
      return;
    }

    if (isNotBlank(password.value) && setPassword.validate()) {
      alert("데이터가 유효하지 않습니다.");
      return;
    }

    const res = await api.managerEdit({
      pk: isNil(manager) ? null : manager.pk,
      id: id.value,
      password: password.value,
      name: name.value,
      phone: phone.value,
      email: email.value,
      job: job.value,
      enable: enable.value,
    });

    if (isNil(res)) {
      return;
    }

    alert("저장되었습니다.");
    if (props.enter === "ACCOUNT") {
      return router.replace(Urls.account["[pk]"].page.url({ pk: res.pk }));
    }

    router.replace(Urls.profile.page.url());
  }, [manager, id, name, phone, email, job, enable, password]);

  return (
    <form onSubmit={preventDefaulted(() => onSubmit())}>
      {props.isShowEnable && (
        <CheckBoxView field={enable} onChange={(checked) => setEnable.set(checked)} col={2} />
      )}

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

      <TextFieldView
        type="password"
        field={password}
        onChange={(value) => setPassword.set(value)}
      />

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
