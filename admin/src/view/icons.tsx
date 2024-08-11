import React from "react";

export const LockIcon = () => {
  return (
    <span className="absolute left-3 top-2.5">
      <i className="mdi mdi-lock-alert-outline text-2xl" />
    </span>
  );
};

export const ProfileIcon = () => {
  return (
    <span className="absolute left-3 top-2.5">
      <i className="mdi mdi-account-outline text-2xl" />
    </span>
  );
};

export const EmailIcon = () => {
  return (
    <span className="absolute left-3 top-2.5">
      <i className="mdi mdi-email-outline text-2xl" />
    </span>
  );
};

export const GreenBadge = (props: { label: string }) => {
  return (
    <p className="inline-flex rounded-full bg-success bg-opacity-10 px-3 py-1 text-sm font-medium text-success">
      {props.label}
    </p>
  );
};

export const RedBadge = (props: { label: string }) => {
  return (
    <p className="inline-flex rounded-full bg-danger bg-opacity-10 px-3 py-1 text-sm font-medium text-danger">
      {props.label}
    </p>
  );
};

export const YellowBadge = (props: { label: string }) => {
  return (
    <p className="inline-flex rounded-full bg-warning bg-opacity-10 px-3 py-1 text-sm font-medium text-warning">
      {props.label}
    </p>
  );
};
