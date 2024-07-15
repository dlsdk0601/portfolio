import { cPk, parseQuery } from "../../../../ex/query";
import { AccountEditView } from "../../../../view/account/accountEditView";

interface Query {
  pk: cPk;
}

const AccountEditPage = (props: { params: Record<string, string> }) => {
  const param = parseQuery<Query>(props.params);

  return <AccountEditView pk={param.pk ?? null} enter="ACCOUNT" />;
};

export default AccountEditPage;
