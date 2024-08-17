"use server";

import { isNil } from "lodash";
import { notFound } from "next/navigation";
import { api } from "../api/api";

export async function projectList() {
  const res = await api.projectList({});

  if (isNil(res)) {
    return;
  }

  return res.projects;
}
