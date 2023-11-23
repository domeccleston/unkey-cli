import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { url } = await request.json();
  console.log({ url });
  const localhostReq = await fetch(url, {
    mode: "no-cors",
  });
  const resp = await localhostReq.text();
  return NextResponse.json({ done: true });
}
