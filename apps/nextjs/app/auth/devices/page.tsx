"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

import { Fingerprint, Loader } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";

function CodeCharacter({ char }: { char: string }) {
  return (
    <div className="p-4 font-mono text-xl lg:text-4xl rounded bg-gray-900">
      {char}
    </div>
  );
}

export default function Page() {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function verify(opts: {
    code: string | null;
    redirect: string | null;
  }) {
    setLoading(true);
    console.log("verifying");
    const req = await fetch("/api/unkey", {
      method: "POST",
      body: JSON.stringify(opts),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!req.ok) {
      throw new Error(`HTTP error! status: ${req.status}`);
    }

    const res = await req.json();

    console.log({ res });

    const redirectUrl = new URL(res.redirect);
    redirectUrl.searchParams.append("code", res.code);
    redirectUrl.searchParams.append("key", res.key);

    console.log({ redirectUrl });

    const localServerReq = await fetch(redirectUrl.toString());

    console.log(await localServerReq.json());

    setLoading(false);
    setSuccess(true);
    toast.success(
      "Authentication successful. You can close this window and return to the CLI."
    );
  }

  const searchParams = useSearchParams();

  const code = searchParams.get("code");
  const _redirect = searchParams.get("redirect");

  const { user } = useUser();

  const opts = { code, redirect: _redirect, id: user?.id };

  return (
    <div className="w-full min-h-screen flex items-center pt-[250px] px-4 flex-col">
      <div className="flex flex-col">
        <div className="flex ">
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
          <div className="grid grid-flow-col gap-1 pt-6 leading-none lg:gap-3 auto-cols-auto">
            {code?.split("").map((char) => (
              <CodeCharacter char={char} key={char} />
            ))}
          </div>
          <div className="flex justify-center pt-6">
            <div className="flex items-center">
              <Button
                variant="default"
                className="mr-2"
                onClick={() => verify(opts)}
                disabled={loading}
              >
                Confirm code
              </Button>
              <Button variant="outline" onClick={() => router.push("/")}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
