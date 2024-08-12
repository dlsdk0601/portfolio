import { ProjectType } from "./schema.g";

export const projectTypeToLabel = (value: ProjectType | null) => {
  switch (value) {
    case "COMPANY":
      return "회사 프로젝트";
    case "PERSONAL":
      return "토이 프로젝트";
    default:
      return "타입";
  }
};
