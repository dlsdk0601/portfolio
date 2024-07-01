"use client";

import React from "react";
import { useParams, useSearchParams } from "next/navigation";

const AccountEditPage = () => {
  const searchParams = useSearchParams();
  const pathname = useParams<{ pk: string }>();
  return (
    <div>
      test
      <p>{pathname.pk}</p>
    </div>
  );
};

export default AccountEditPage;
