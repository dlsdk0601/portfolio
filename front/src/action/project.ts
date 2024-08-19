"use server";

import { isNil } from "lodash";
import { api } from "../api/api";

export async function projectList() {
  const res = await api.projectList({});

  if (isNil(res)) {
    return;
  }

  return res.projects;
}

export async function projectShow(pk: number) {
  const res = await api.projectShow({ pk });

  if (isNil(res)) {
    return;
  }

  return res;
}

export async function projectView(pk: number) {
  const res = await api.projectView({ pk });

  if (isNil(res)) {
    return;
  }

  return res.views;
}
