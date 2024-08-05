"use client";

import { isNil } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cPk, isNewPk } from "../../ex/query";
import { Replace } from "../layout/layoutSelector";
import { Urls } from "../../url/url.g";
import { ContactShowRes, ContactType, contactTypeValues, toContactType } from "../../api/schema.g";
import { ignorePromise, preventDefaulted } from "../../ex/utils";
import { api } from "../../api/api";
import useValueField from "../../hooks/useValueField";
import { validateFields, vRequired } from "../../ex/validate";
import TextFieldView from "../textFieldView";
import { ProfileIcon } from "../icons";
import { SelectView } from "../selectView";

export const ContactEditView = (props: { pk: cPk | null }) => {
  const pk = props.pk;

  if (isNil(pk)) {
    return <Replace url={Urls.account.page.url()} />;
  }

  const [contact, setContact] = useState<ContactShowRes | null>(null);

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

    const res = await api.contactShow({ pk: p });

    if (isNil(res)) {
      return;
    }

    setContact({ ...res });
  }, []);

  return <ContactFormEditView contact={contact} />;
};

export const ContactFormEditView = (props: { contact: ContactShowRes | null }) => {
  const router = useRouter();

  const contact = props.contact;
  const [type, setType] = useValueField<ContactType | null>(null, "타입", vRequired);
  const [id, setId] = useValueField<string>("", "아이디", vRequired);
  const [href, setHref] = useValueField<string>("", "링크", vRequired);

  useEffect(() => {
    if (isNil(contact)) {
      return;
    }

    setType.set(contact.type);
    setId.set(contact.id);
    setHref.set(contact.href);
  }, [contact]);

  const onSubmit = useCallback(async () => {
    const isValid = validateFields([setId, setType, setHref]);

    if (!isValid || isNil(type.value)) {
      alert("데이터가 유효하지 않습니다.");
      return;
    }

    const res = await api.contactEdit({
      pk: isNil(contact) ? null : contact.pk,
      type: type.value,
      id: id.value,
      href: href.value,
    });

    if (isNil(res)) {
      return;
    }

    alert("저장되었습니다.");
    router.replace(Urls.contact["[pk]"].page.url({ pk: res.pk }));
  }, [contact, type, id, href]);

  const onDelete = useCallback(async () => {
    if (isNil(contact)) {
      return;
    }

    if (!confirm("삭제 하시겠습니까?")) {
      return;
    }

    const res = await api.contactDelete({ pk: contact.pk });

    if (isNil(res)) {
      return;
    }

    alert("삭제 되었습니다.");
    router.replace(Urls.contact.page.url({}));
  }, [contact]);

  return (
    <form onSubmit={preventDefaulted(() => onSubmit())}>
      <SelectView<ContactType | null>
        value={type.value}
        options={["타입", ...contactTypeValues].map((item) => ({
          label: item,
          value: toContactType(item),
        }))}
        onChange={(value) => setType.set(value)}
      />
      <TextFieldView field={id} onChange={(value) => setId.set(value)} icon={<ProfileIcon />} />
      <TextFieldView field={href} onChange={(value) => setHref.set(value)} />

      <div className="flex justify-end gap-4.5">
        <button
          type="button"
          className="mr-3 flex justify-center rounded bg-danger px-6 py-2 font-medium text-gray hover:bg-opacity-90"
          onClick={() => onDelete()}
        >
          Delete
        </button>
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
