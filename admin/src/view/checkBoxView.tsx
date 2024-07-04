"use client";

import classNames from "classnames";
import { ValueField } from "../hooks/useValueField";

export const CheckBoxView = (props: {
  field: ValueField<boolean>;
  onChange: (value: boolean) => void;
  label?: string;
  col?: 2 | 3;
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
      <label htmlFor="toggle4" className="flex cursor-pointer select-none items-center">
        <div className="relative">
          <input
            id="toggle4"
            className="sr-only"
            type="checkbox"
            checked={props.field.value}
            onChange={(e) => props.onChange(e.target.checked)}
          />
          <div className="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]" />
          <div
            className={classNames(
              "absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition",
              {
                "!right-1 !translate-x-full !bg-primary dark:!bg-white": props.field.value,
              },
            )}
          />
        </div>
      </label>
    </div>
  );
};
