"use client";

import { useUser } from "@clerk/nextjs";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

import { Fingerprint } from "lucide-react";

export default function Page() {
  const [data, setData] = useState();
  const [success, setSuccess] = useState(false);
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

    const localServerReq = await fetch(redirectUrl.toString(), {
      mode: "no-cors",
    });

    const localServerRes = await localServerReq.text();

    console.log(localServerRes);

    setSuccess(true);
  }

  const searchParams = useSearchParams();

  const code = searchParams.get("code");
  const _redirect = searchParams.get("redirect");

  const { user } = useUser();

  const opts = { code, redirect: _redirect, id: user?.id };

  return (
    <div className="bg-[#111] w-full min-h-screen text-gray-100 flex items-center pt-[200px] px-4 flex-col">
      <div className="flex">
        <div className="flex justify-center items-center pr-4">
          <Fingerprint />
        </div>
        <div className="flex-col">
          <h1 className="text-lg">Device confirmation</h1>
          <p className="text-sm text-gray-500">Please confirm this is the code shown in your terminal</p>
        </div>
      </div>
      {/* <div>Code: {code}</div>
      <p>Does this match what you see in your terminal?</p>
      <button className="bg-gray-300" onClick={() => verify(opts)}>
        Yes
      </button>
      <pre>{JSON.stringify(data)}</pre>
      <pre>{success ? "Authentication successful." : ""}</pre> */}
    </div>
  );
}
