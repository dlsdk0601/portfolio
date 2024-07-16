"use server";

import { isNil } from "lodash";
import { redirect } from "next/navigation";
import { api } from "../api/api";
import { Urls } from "../url/url.g";

export async function contactList() {
  const res = await api.contactShow({});

  if (isNil(res)) {
    redirect(Urls.not_found.url());
  }

  return res;
}
