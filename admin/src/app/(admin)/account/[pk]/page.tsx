"use client";

import React from "react";
import { useParams } from "next/navigation";

interface Query {
  pk: number;
}

const AccountEditPage = (props: { params: Query }) => {
  const pk = props.params.pk;
  console.log(pk);
  console.log(typeof pk);

  const param = useParams<{ pk: string }>();
  console.log(param);
  console.log(param.pk);
  console.log(typeof param.pk);

  return (
    <div>
      test
      <p>pk: {pk}</p>
      <p>param: {param.pk}</p>
    </div>
  );
};

export default AccountEditPage;
