import { NextResponse } from "next/server";

export async function POST(request: Request) {
	const { url } = await request.json();
	const localhostReq = await fetch(url, {
		mode: "no-cors",
	});
	const resp = await localhostReq.text();
	return NextResponse.json({ done: true });
}
