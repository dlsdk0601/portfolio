"use server";

import { isNil } from "lodash";
import { notFound } from "next/navigation";
import { api } from "../api/api";

export async function contactList() {
  const res = await api.contactShow({});

  if (isNil(res)) {
    notFound();
  }

  return res;
}
