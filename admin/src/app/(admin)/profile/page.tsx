"use client";

import { useEffect } from "react";
import { EmailIcon, ProfileIcon } from "../../../view/icons";
import TextFieldView from "../../../view/textFieldView";
import useValueField from "../../../hooks/useValueField";
import { vEmail, vRequired } from "../../../ex/validate";
import { managerModel } from "../../../store/managerModel";
import { preventDefaulted } from "../../../ex/utils";

const Page = () => {
  const manager = managerModel((state) => state);
  const [name, setName] = useValueField<string>("", "이름", vRequired);
  const [phone, setPhone] = useValueField<string>("", "휴대폰 번호", vRequired);
  const [email, setEmail] = useValueField<string>("", "이메일", vRequired, vEmail);
  const [id, setId] = useValueField<string>("", "ID", vRequired);
  const [job, setJob] = useValueField<string>("", "직업");

  useEffect(() => {
    setName.set(manager.name);
    setPhone.set(manager.phone);
    setEmail.set(manager.email);
    setId.set(manager.id);
    setJob.set(manager.job);
  }, []);

  const onSubmit = async () => {};

  return (
    <form onSubmit={() => preventDefaulted(onSubmit)}>
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

export default Page;
