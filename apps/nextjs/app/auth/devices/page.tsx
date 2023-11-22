"use client";

import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();

  const code = searchParams.get("code");

  return <div>Code: {code}</div>;
}
