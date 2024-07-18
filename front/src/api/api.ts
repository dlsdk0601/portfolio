import { map } from "lodash";
import { notFound } from "next/navigation";
import { ResStatus, ValidationError } from "./schema.g";
import { Api } from "./api.g";
import { blockModel } from "../store/blockModel";

export interface ApiHandler {
  catch(e: any): void;

  handleValidationErrors(errors: ValidationError[]): void;

  handlerErrors(errors: string[]): void;

  with<T>(block: () => Promise<T>): Promise<T>;

  handleStatus(status: ResStatus): void;
}

class Handler implements ApiHandler {
  handleStatus(status: ResStatus) {
    switch (status) {
      case ResStatus.OK:
        return;
      case ResStatus.INVALID_ACCESS_TOKEN: {
        throw new Error("사용자 정보가 만료되었습니다.\n재시작 하시겠습니까?", {
          cause: ResStatus.INVALID_ACCESS_TOKEN,
        });
      }
      case ResStatus.LOGIN_REQUIRED: {
        throw new Error("로그인 페이지로 이동합니다.", { cause: ResStatus.LOGIN_REQUIRED });
      }
      case ResStatus.NO_PERMISSION: {
        throw new Error("권한이 없습니다.", { cause: ResStatus.NO_PERMISSION });
      }
      case ResStatus.NOT_FOUND:
      default: {
        notFound();
      }
    }
  }

  catch(e: any) {
    // api 에서 catch 가 걸린거라면 알수 없는 에러이다.
    console.error(e);
    throw new Error("예상치 못한 에러가 발생했습니다.");
  }

  handleValidationErrors(errors: ValidationError[]) {
    console.error(...errors);
    const messages = map(errors, (err) => `${err.loc} : ${err.msg}`).join("\n");
    if (messages) {
      throw new Error(messages);
    } else {
      throw new Error(JSON.stringify(errors, null, 2));
    }
  }

  handlerErrors(errors: string[]) {
    console.error(...errors);
    throw new Error(...errors);
  }

  with<T>(block: () => Promise<T>): Promise<T> {
    return blockModel.getState().with(block);
  }
}

export const handler = new Handler();
export const api = new Api(handler);
