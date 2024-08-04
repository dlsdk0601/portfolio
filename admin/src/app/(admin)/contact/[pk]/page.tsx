import { cPk, parseQuery } from "../../../../ex/query";
import { ContactEditView } from "../../../../view/contact/contactEditView";

interface Query {
  pk: cPk;
}

const ContactEditPage = (props: { params: Record<string, string> }) => {
  const param = parseQuery<Query>(props.params);

  return <ContactEditView pk={param.pk ?? null} />;
};

export default ContactEditPage;
