import { isString, map } from "lodash";
import { ResStatus } from "./schema.g";
import { managerModel } from "../store/managerModel";
import { Urls } from "../url/url.g";
import { blockModel } from "../store/blockModel";
import { Api } from "./api.g";

export interface PydanticValidationError {
  loc: string[];
  msg: string;
}

export interface ApiHandler {
  catch(e: any): void;

  handleValidationErrors(errors: PydanticValidationError[]): void;

  handlerErrors(errors: string[]): void;

  with<T>(block: () => Promise<T>): Promise<T>;

  handleStatus(status: ResStatus): void;
}

class Handler implements ApiHandler {
  handleStatus(status: ResStatus) {
    if (typeof window === "undefined") {
      alert("웹사이트 로딩중");
    }

    switch (status) {
      case "OK":
        return;
      case "INVALID_ACCESS_TOKEN": {
        // 처음 부터 로그인이 안된 경우
        if (managerModel.getState().token === null) {
          // return-to 체크가 불가능
          window.location.href = Urls["sign-in"].page.url();
        }

        if (confirm("사용자 정보가 만료되었습니다.\n재시작 하시겠습니까?")) {
          managerModel.getState().deInit();
          window.location.replace(Urls["sign-in"].page.url());
        }
        return;
      }
      case "LOGIN_REQUIRED": {
        managerModel.getState().deInit();
        alert("로그인 페이지로 이동합니다.");
        window.location.href = Urls["sign-in"].page.url();
        return;
      }
      case "NO_PERMISSION": {
        alert("권한이 없습니다.");
        window.location.href = Urls.page.url();
        return;
      }
      case "NOT_FOUND":
      default: {
        alert("존재하지 않는 페이지 또는 데이터입니다.");
      }
    }
  }

  catch(e: any) {
    console.error(e);

    if (e.message) {
      alert(e.message);
      return;
    }

    if (isString(e)) {
      alert(e);
      return;
    }

    alert(JSON.stringify(e));
  }

  handleValidationErrors(errors: PydanticValidationError[]) {
    console.error(...errors);

    try {
      const messages = map(errors, (err) => `${err.loc} : ${err.msg}`).join("\n");
      if (messages) {
        alert(messages);
      } else {
        alert(JSON.stringify(errors, null, 2));
      }
    } catch (e) {
      // pydanticValidationError 의 타입이 정확하지 않기 때문에 항상 출력
      console.error(e);
      alert(`${e}`);
    }
  }

  handlerErrors(errors: string[]) {
    alert(errors.join("\n"));
  }

  with<T>(block: () => Promise<T>): Promise<T> {
    return blockModel.getState().with(block);
  }
}

export const handler = new Handler();
export const api = new Api(handler);
