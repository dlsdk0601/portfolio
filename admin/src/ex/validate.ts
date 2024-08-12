import { isEmpty, isNil } from "lodash";
import isEmail from "validator/lib/isEmail";
import isUrl from "validator/lib/isURL";
import { isBlank, isNotNil } from "./utils";
import { SetValueField } from "../hooks/useValueField";

export type VALIDATE = (value: any) => string | undefined;

export const vRequired: VALIDATE = (value) => {
  if (isBlank(value) || isNil(value)) {
    return "필수 입력사항입니다.";
  }
};

export const vLength = (length: number): VALIDATE => {
  return (value) => {
    if (isBlank(value) || isNil(value)) {
      return "필수 입력사항입니다.";
    }

    if (value.length > length) {
      return `${length}자 이내여야 합니다.`;
    }
  };
};

export const vEmail: VALIDATE = (value) => {
  if (typeof value !== "string") {
    return "문자로 입력해주세요.";
  }

  // 값이 없을 경우 무시
  if (isNil(value) || isEmpty(value)) {
    return "이메일은 필수 입력사항입니다.";
  }

  if (!isEmail(value)) {
    return "이메일 형식에 맞게 입력해주세요";
  }
};

export const vPhone: VALIDATE = (value) => {
  if (typeof value !== "string") {
    return "문자로 입력해주세요.";
  }

  if (isNil(value) || isEmpty(value)) {
    return "핸드폰번호는 필수 입력사항입니다.";
  }

  const cleaned = value.replaceAll("-", "");
  const matcher: RegExp = /^(\d{3})(\d{4})(\d{4})$/;

  if (!cleaned.startsWith("01")) {
    return "핸드폰번호 형식이 잘 못 되었습니다.";
  }

  if (!cleaned.match(matcher)) {
    return "핸드폰번호 형식이 잘 못 되었습니다.";
  }
};

export const vUrl: VALIDATE = (value) => {
  if (isNil(value) || isEmpty(value)) {
    return "url은 필수 입력사항입니다.";
  }

  if (!isUrl(value)) {
    return "URL 형식에 맞게 입력해주세요";
  }
};

export const vPassword: VALIDATE = (value) => {
  if (typeof value !== "string") {
    return "문자로 입력해주세요.";
  }

  const reg = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,}$/;
  if (!value.match(reg)) {
    return "비밀번호는 8자 이상 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.";
  }
};

export const vBirthday: VALIDATE = (value) => {
  if (typeof value !== "string") {
    return "문자로 입력해주세요.";
  }

  if (isNil(value) || isEmpty(value)) {
    return "생년월일은 필수 입력사항입니다.";
  }

  const reg = /\b\d{6}\b/;
  if (!value.match(reg)) {
    return "생년월일은 6자리여야 합니다.";
  }
};

export type FileType = "IMAGE" | "PDF" | "VIDEO";
export const vFileExtension = (value: any, types: FileType[]): string | undefined => {
  if (typeof value !== "string") {
    return "확장자 형식이 잘못되었습니다.";
  }

  // 값이 없을 경우 무시
  if (isNil(value) || isEmpty(value)) {
    return "확장자 형식이 잘못되었습니다.";
  }

  let isValid = true;
  let error = "";
  for (const type of types) {
    switch (type) {
      case "PDF": {
        isValid = isNotNil(value.match(/^application\/pdf$/));
        error = "PDF 확장자가 아닙니다.";
        break;
      }
      case "VIDEO": {
        isValid = isNotNil(value.match(/^video\/(mp4|webm)$/));
        error = "비디오 확장자가 아닙니다.";
        break;
      }
      case "IMAGE":
      default: {
        error = "이미지 확장자가 아닙니다.";
        isValid = isNotNil(value.match(/^image\/(jpeg|png|jpg)$/));
      }
    }
  }

  if (!isValid) {
    return error;
  }
};

export function validateFields(setFields: SetValueField<any>[]) {
  let isValid = true;
  for (const field of setFields) {
    const isErr = field.validate();

    if (isErr) {
      isValid = false;
      break;
    }
  }

  return isValid;
}
