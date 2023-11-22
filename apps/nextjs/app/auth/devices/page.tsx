"use client";

import { useUser } from "@clerk/nextjs";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const [data, setData] = useState();
  const router = useRouter();

  async function verify(opts: {
    code: string | null;
    redirect: string | null;
  }) {
    console.log(opts);
    const req = await fetch("/api/unkey", {
      method: "POST",
      body: JSON.stringify(opts),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await req.json();

    const redirectUrl = new URL(res.redirect);
    redirectUrl.searchParams.append("code", res.code);
    redirectUrl.searchParams.append("key", res.key);

    console.log(redirectUrl.toString());

    router.push(redirectUrl.toString());
  }

  const searchParams = useSearchParams();

  const code = searchParams.get("code");
  const _redirect = searchParams.get("redirect");

  const { user } = useUser();

  const opts = { code, redirect: _redirect, id: user?.id };

  return (
    <>
      <div>Code: {code}</div>
      <p>Does this match what you see in your terminal?</p>
      <button onClick={() => verify(opts)}>Yes</button>
      <pre>{JSON.stringify(data)}</pre>
    </>
  );
}
