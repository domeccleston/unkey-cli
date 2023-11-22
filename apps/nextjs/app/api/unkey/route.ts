import { NextResponse } from "next/server";
import { Unkey } from "@unkey/api";

export async function POST(request: Request) {
  const { id, redirect, code } = await request.json();
  if (!process.env.UNKEY_ROOT_KEY || !process.env.UNKEY_API) {
    return NextResponse.json({
      statusCode: 500,
      message: "Unkey root key and API ID must be provided.",
    });
  }
  const unkey = new Unkey({ rootKey: process.env.UNKEY_ROOT_KEY });

  console.log(redirect);

  const { result, error } = await unkey.keys.create({
    apiId: process.env.UNKEY_API,
    prefix: "cli_demo",
    ownerId: id,
  });

  if (error) {
    return NextResponse.json({
      statusCode: 500,
      message: "Error creating key – please ensure apiId is valid.",
    });
  }

  return NextResponse.json({ ...result, code, redirect });
}
