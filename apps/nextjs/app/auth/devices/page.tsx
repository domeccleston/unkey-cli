"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

import { Fingerprint } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";

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
    <div className="w-full min-h-screen  flex items-center pt-[200px] px-4 flex-col">
      <div className="flex">
        <div className="flex justify-center items-center pr-4">
          <Fingerprint className="text-gray-100" />
        </div>
        <div className="flex-col">
          <h1 className="text-lg text-gray-100">Device confirmation</h1>
          <p className="text-sm text-gray-500">
            Please confirm this is the code shown in your terminal
          </p>
        </div>
      </div>
      <div>
        <div></div>
        <div className="flex justify-center pt-4">
          <div className="flex items-center">
            <Button variant="default" className="mr-2">Confirm code</Button>
            <Button variant="outline">Cancel</Button>
          </div>
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
