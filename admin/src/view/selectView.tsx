"use client";

import React from "react";
import { BottomArrowIcon } from "./icons";

interface SELECT_OPTION<T> {
  label: string;
  value: T;
}

export const SelectView = <T,>(props: {
  options: SELECT_OPTION<T>[];
  value: T;
  onChange: (value: T) => void;
}) => {
  return (
    <div className="relative z-20 bg-white dark:bg-form-input">
      <select
        className="relative z-20 w-full appearance-none rounded-l-lg border border-stroke bg-transparent py-2.5 pl-7 pr-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
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
      <BottomArrowIcon />
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
  return JSON.parse(value);
};
