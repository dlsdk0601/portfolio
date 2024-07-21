import { ContactType } from "./schema.g";

export const contactTypes: ContactType[] = [
  ContactType.EMAIL,
  ContactType.GITHUB,
  ContactType.INSTAGRAM,
];

export const labelToContactType = (type: string | undefined | null): ContactType | null => {
  switch (type) {
    case "EMAIL":
      return ContactType.EMAIL;
    case "GITHUB":
      return ContactType.GITHUB;
    case "INSTAGRAM":
      return ContactType.INSTAGRAM;
    default:
      return null;
  }
};
