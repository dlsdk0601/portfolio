"use client";

import "flatpickr/dist/flatpickr.min.css";
import classNames from "classnames";
import { Moment } from "moment";
import { head, isNil } from "lodash";
import Flatpickr from "react-flatpickr";
import { ValueField } from "../hooks/useValueField";
import { isBlank, isNotBlank } from "../ex/utils";

const DatePickerView = (props: {
  field: ValueField<Moment | null>;
  onChange: (value: Date) => void;
  label?: string;
  placeholder?: string;
  col?: 2 | 3;
}) => {
  return (
    <div
      className={classNames("mb-5.5 w-full", {
        "sm:w-1/2": props.col === 2,
        "sm:w-1/3": props.col === 3,
      })}
    >
      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
        {props.label ?? props.field.name}
      </label>
      <div className="relative">
        <Flatpickr
          options={{
            locale: "ko",
            mode: "single",
            static: true,
            monthSelectorType: "static",
          }}
          className={classNames(
            "w-full rounded border-[1.5px] bg-transparent px-5 py-3 font-normal outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input",
            {
              "border-meta-1 focus:border-meta-1 dark:focus:border-meta-1": isNotBlank(
                props.field.error,
              ),
              "border-stroke focus:border-primary dark:focus:border-primary": isBlank(
                props.field.error,
              ),
            },
          )}
          placeholder={props.placeholder ?? "mm/dd/yyyy"}
          value={props.field.value?.toDate()}
          onChange={(dates) => {
            const date = head(dates);
            if (isNil(date)) {
              return;
            }

            props.onChange(date);
          }}
        />

        <div className="pointer-events-none absolute inset-0 left-auto right-5 flex items-center">
          <i className="mdi mdi-calendar text-3xl" />
        </div>
      </div>
      {isNotBlank(props.field.error) && (
        <p className="mt-1 text-xs italic text-meta-1">{props.field.error}</p>
      )}
    </div>
  );
};

export default DatePickerView;
