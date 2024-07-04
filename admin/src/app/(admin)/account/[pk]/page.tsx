import { parseQuery } from "../../../../ex/query";
import { AccountEditView } from "../../../../view/account/accountEditView";

interface Query {
  pk: number;
}

const AccountEditPage = (props: { params: Record<string, string> }) => {
  const param = parseQuery<Query>(props.params);

  return <AccountEditView pk={param.pk ?? null} />;
};

export default AccountEditPage;
