"use client";

import React from "react";
import classNames from "classnames";
import { ValueField } from "../hooks/useValueField";
import { isBlank, isNotBlank } from "../ex/utils";

export interface SELECT_OPTION<T> {
  label: string;
  value: T;
}

export const SelectView = <T,>(props: {
  options: SELECT_OPTION<T>[];
  value: T;
  onChange: (value: T) => void;
  error?: string;
}) => {
  return (
    <div className="relative z-20 bg-white dark:bg-form-input">
      <select
        className={classNames(
          "relative z-20 w-full appearance-none rounded-l-lg border bg-transparent py-2.5 pl-7 pr-12 outline-none transition active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white",
          {
            "border-meta-1 focus:border-meta-1": isNotBlank(props.error),
            "border-stroke focus:border-primary": isBlank(props.error),
          },
        )}
        value={stringify(props.value)}
        onChange={(e) => props.onChange(parseStringify(e.target.value))}
      >
        {props.options.map((option) => (
          <option
            key={`select-option-${option.label}`}
            className="text-body dark:text-bodydark"
            value={stringify(option.value)}
          >
            {option.label}
          </option>
        ))}
      </select>
      <i className="mdi mdi-chevron-down absolute right-4 top-1/2 z-30 -translate-y-1/2 text-2xl dark:text-white" />
      {/* <BottomArrowIcon /> */}
    </div>
  );
};

export const SelectFieldView = <T,>(props: {
  field: ValueField<T | null>;
  options: string[];
  onChange: (value: T | null) => void;
  mapper: (label: string | null) => T | null;
  label?: string;
  col?: 2 | 3;
}) => {
  const options: string[] = [`${props.label ?? props.field.name} 선택해주세요.`, ...props.options];
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
      <SelectView<T | null>
        value={props.field.value}
        options={options.map((item) => ({
          label: item,
          value: props.mapper(item),
        }))}
        onChange={(value) => props.onChange(value)}
        error={props.field.error}
      />
      {isNotBlank(props.field.error) && (
        <p className="mt-1 text-xs italic text-meta-1">{props.field.error}</p>
      )}
    </div>
  );
};

export const stringify = <T,>(value: T): string => {
  if (typeof value === "string") {
    return value;
  }

  return JSON.stringify(value);
};

export const parseStringify = <T,>(value: string): T => {
  if (value === stringify(value)) {
    return value as T;
  }

  return JSON.parse(value);
};
