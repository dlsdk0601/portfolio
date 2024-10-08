"use client";

import { ReactNode } from "react";
import classNames from "classnames";
import { isNil } from "lodash";
import { ValueField } from "../hooks/useValueField";
import { k } from "../ex/korean-postposition";
import { isBlank, isNotBlank, isNotNil } from "../ex/utils";

const TextFieldView = (props: {
  field: ValueField<string>;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  icon?: ReactNode;
  col?: 2 | 3;
  type?: "text" | "password" | "email" | "tel";
}) => {
  return (
    <div
      className={classNames("mb-5.5 w-full", {
        "sm:w-1/2": props.col === 2,
        "sm:w-1/3": props.col === 3,
      })}
    >
      <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
        {props.label ?? props.field.name}
      </label>
      <div className="relative">
        {props.icon}
        <input
          type={props.type ?? "text"}
          className={classNames(
            "w-full rounded border py-3 pr-4.5 text-black focus-visible:outline-none dark:bg-meta-4 dark:text-white dark:focus:border-primary",
            {
              "pl-11.5": isNotNil(props.icon),
              "pl-6": isNil(props.icon),
              "border-meta-1 focus:border-meta-1": isNotBlank(props.field.error),
              "border-stroke focus:border-primary": isBlank(props.field.error),
            },
          )}
          name={props.field.name}
          placeholder={props.placeholder ?? `${k(props.field.name)} 입력해주세요.`}
          value={props.field.value}
          onChange={(e) => props.onChange(e.target.value)}
        />
      </div>
      {isNotBlank(props.field.error) && (
        <p className="mt-1 text-xs italic text-meta-1">{props.field.error}</p>
      )}
    </div>
  );
};

export const ReadyOnlyView = (props: {
  field: string;
  label?: string;
  placeholder?: string;
  icon?: ReactNode;
  col?: 2 | 3;
}) => {
  return (
    <div
      className={classNames("mb-5.5 w-full", {
        "sm:w-1/2": props.col === 2,
        "sm:w-1/3": props.col === 3,
      })}
    >
      {isNotNil(props.label) && (
        <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
          {props.label}
        </label>
      )}
      <div className="relative">
        {props.icon}
        <input
          type="text"
          className={classNames(
            "w-full rounded border border-stroke bg-gray py-3 pr-4.5 text-black focus-visible:outline-none dark:bg-meta-4 dark:text-white dark:focus:border-primary",
            {
              "pl-11.5": isNotNil(props.icon),
              "pl-6": isNil(props.icon),
            },
          )}
          placeholder={props.placeholder ?? "자동 생성됩니다."}
          value={props.field}
          readOnly
        />
      </div>
    </div>
  );
};

export const TextAreaFieldView = (props: {
  field: ValueField<string>;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  icon?: ReactNode;
  col?: 2 | 3;
  rows?: number;
}) => {
  return (
    <div
      className={classNames("mb-5.5 w-full", {
        "sm:w-1/2": props.col === 2,
        "sm:w-1/3": props.col === 3,
      })}
    >
      <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
        {props.label ?? props.field.name}
      </label>
      <div className="relative">
        {props.icon}
        <textarea
          rows={props.rows ?? 3}
          className={classNames(
            "w-full rounded border py-3 pr-4.5 text-black focus-visible:outline-none dark:bg-meta-4 dark:text-white dark:focus:border-primary",
            {
              "pl-11.5": isNotNil(props.icon),
              "pl-6": isNil(props.icon),
              "border-meta-1 focus:border-meta-1": isNotBlank(props.field.error),
              "border-stroke focus:border-primary": isBlank(props.field.error),
            },
          )}
          name={props.field.name}
          placeholder={props.placeholder ?? `${k(props.field.name)} 입력해주세요.`}
          value={props.field.value}
          onChange={(e) => props.onChange(e.target.value)}
        />
      </div>
      {isNotBlank(props.field.error) && (
        <p className="mt-1 text-xs italic text-meta-1">{props.field.error}</p>
      )}
    </div>
  );
};

export default TextFieldView;
