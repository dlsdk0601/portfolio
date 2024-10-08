"use client";

import { isNil } from "lodash";
import { useState } from "react";
import { Moment } from "moment";
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

export type RETURN_TYPE<T> = [ValueField<T>, SetValueField<T>];

const useValueField = <T>(init: T, name: string, ...validators: Validator<T>[]): RETURN_TYPE<T> => {
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

// shortcut
export const useStringField = (
  name: string,
  ...validators: Validator<string>[]
): RETURN_TYPE<string> => {
  const [value, set] = useValueField<string>("", name, ...validators);

  return [value, set];
};

export const useIntField = (
  name: string,
  ...validators: Validator<number | null>[]
): RETURN_TYPE<number | null> => {
  const [value, set] = useValueField<number | null>(null, name, ...validators);

  return [value, set];
};

export const useBooleanField = (
  name: string,
  ...validators: Validator<boolean | null>[]
): RETURN_TYPE<boolean | null> => {
  const [value, set] = useValueField<boolean | null>(null, name, ...validators);

  return [value, set];
};

export const useMomentField = (
  name: string,
  ...validators: Validator<Moment | null>[]
): RETURN_TYPE<Moment | null> => {
  const [value, set] = useValueField<Moment | null>(null, name, ...validators);

  return [value, set];
};

export const useTypeField = <T>(
  name: string,
  ...validators: Validator<T | null>[]
): RETURN_TYPE<T | null> => {
  const [value, set] = useValueField<T | null>(null, name, ...validators);

  return [value, set];
};

export default useValueField;
