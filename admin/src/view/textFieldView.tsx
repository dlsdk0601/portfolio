"use client";

import { ReactNode } from "react";
import classNames from "classnames";
import { isNil } from "lodash";
import { ValueField } from "../hooks/useValueField";
import { k } from "../ex/korean-postposition";
import { isNotNil } from "../ex/utils";

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
            "w-full rounded border border-stroke bg-gray py-3 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary",
            {
              "pl-11.5": isNotNil(props.icon),
              "pl-6": isNil(props.icon),
            },
          )}
          name={props.field.name}
          placeholder={props.placeholder ?? `${k(props.field.name)} 입력해주세요.`}
          value={props.field.value}
          onChange={(e) => props.onChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default TextFieldView;
