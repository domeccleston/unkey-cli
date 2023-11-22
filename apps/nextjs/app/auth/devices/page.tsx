"use client";

import { useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function Page() {
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

    console.log(res);
  }

  const searchParams = useSearchParams();

  const code = searchParams.get("code");
  const redirect = searchParams.get("redirect");

  const { user } = useUser();

  const opts = { code, redirect, id: user?.id };

  return (
    <>
      <div>Code: {code}</div>
      <p>Does this match what you see in your terminal?</p>
      <button onClick={() => verify(opts)}>Yes</button>
    </>
  );
}
