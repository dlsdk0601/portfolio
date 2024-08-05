"use client";

import { isNil } from "lodash";
import { useState } from "react";
import { isNotNil } from "../ex/utils";
import { k } from "../ex/korean-postposition";

export type ValueField<T> = {
  value: T;
  error: string;
  name: string;
};

type Validator<T> = (value: T) => string | undefined;

export interface SetValueField<T> {
  set: (payload: T) => void;
  err: (error?: string) => void;
  validate: () => boolean;
}

const useValueField = <T>(
  init: T,
  name: string,
  ...validators: Validator<T>[]
): [ValueField<T>, SetValueField<T>] => {
  const [state, setState] = useState<ValueField<T>>({
    value: init,
    error: "",
    name,
  });

  const onChangeState = (payload: T) => {
    setState({ ...state, value: payload, error: "" });
  };

  const onError = (error?: string) => {
    if (isNil(error)) {
      onDefaultError();
      return;
    }
    setState({ ...state, error });
  };

  const onDefaultError = () => {
    setState({ ...state, error: k(`${state.name}(은|는) 필수입니다.`) });
  };

  const validate = (): boolean => {
    let res = false;

    // 숫자 타입은 1 이하를 잡는다.
    if (typeof state.value === "number" && state.value < 1) {
      onDefaultError();
      res = true;
      return res;
    }

    for (const validator of validators) {
      const errorMessage = validator(state.value);
      if (isNotNil(errorMessage)) {
        setState({ ...state, error: errorMessage });
        res = true;
        break;
      }
    }

    return res;
  };

  return [state, { set: onChangeState, err: onError, validate }];
};

export default useValueField;
