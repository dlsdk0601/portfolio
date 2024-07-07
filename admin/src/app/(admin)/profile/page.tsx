"use client";

import { isNil } from "lodash";
import { managerModel } from "../../../store/managerModel";
import { AccountFormEditView } from "../../../view/account/accountEditView";

const Page = () => {
  const manager = managerModel((state) => state);

  // pk 가 없다면 로그인이 안됬다는거다.
  // 일단 아무것도 안보여주고 있으면 로그인 페이지로 이동 될거다.
  if (isNil(manager.pk)) {
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
    />
  );
};

export default Page;
