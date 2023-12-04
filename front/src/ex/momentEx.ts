import moment, { Moment } from "moment";

export function safeMoment(datetime: string | null | undefined): Moment | undefined {
  if (datetime) {
    const m = moment(datetime, true);
    if (m.isValid()) {
      return m;
    }
  }
}

const FORMAT_ISO_TIME = "HH:mm";

export function formatIsoTime(m: Moment): string {
  return m.format(FORMAT_ISO_TIME);
}

export function fromIsoFormatTime(time: string): Moment | undefined {
  const m = moment(time, FORMAT_ISO_TIME);
  return m.isValid() ? m : undefined;
}

const FORMAT_ISO_DATE = "YYYY-MM-DD";

export function formatIsoDate(m: Moment): string {
  return m.format(FORMAT_ISO_DATE);
}

export const betweenFormatIsoDateToString = (start: Moment | null, end: Moment | null): string => {
  if (!!start && !!end) {
    return `${formatIsoDate(start)} ~ ${formatIsoDate(end)}`;
  }
  return "";
};

export function fromIsoFormatDate(date: string): Moment | undefined {
  const m = moment(date, FORMAT_ISO_DATE);
  return m.isValid() ? m : undefined;
}

const FORMAT_ISO_DATE_TIME = "YYYY-MM-DD HH:mm";

export function formatIsoDateTime(m: Moment): string {
  return m.format(FORMAT_ISO_DATE_TIME);
}

export function fromIsoFormatDateTime(datetime: string): Moment | undefined {
  const m = moment(datetime, FORMAT_ISO_DATE_TIME);
  return m.isValid() ? m : undefined;
}
