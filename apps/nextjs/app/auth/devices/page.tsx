"use client";

import { useSearchParams, useRouter, notFound } from "next/navigation";
import { useState } from "react";

import { Fingerprint, XCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";

function CodeCharacter({ char }: { char: string }) {
	return (
		<div className="p-2 lg:p-4 font-mono text-xl lg:text-4xl rounded bg-gray-900">
			{char}
		</div>
	);
}

export default function Page() {
	const [loading, setLoading] = useState(false);
	const [cancelled, setCancelled] = useState(false);

	const router = useRouter();

	async function cancel(localServer: string) {
		await fetch("/api/unkey/cancel", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ localServer }),
		});

		setCancelled(true);
	}

	async function verify(opts: {
		code: string | null;
		redirect: string | null;
	}) {
		setLoading(true);
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

		const redirectUrl = new URL(res.redirect);
		redirectUrl.searchParams.append("code", res.code);
		redirectUrl.searchParams.append("key", res.key);

		await fetch(redirectUrl.toString());

		setLoading(false);
		toast.success(
			"Authentication successful. You can close this window and return to the CLI.",
		);
	}

	const searchParams = useSearchParams();

	const code = searchParams.get("code");
	const _redirect = searchParams.get("redirect");

	const { user } = useUser();

	if (!code || !_redirect) {
		return notFound();
	}

	const opts = { code, redirect: _redirect, id: user?.id };

	return (
		<div className="w-full min-h-screen flex items-center pt-[250px] px-4 flex-col">
			{cancelled ? (
				<div className="flex pt-10">
					<div className="flex justify-center items-center pr-10">
						<XCircle className="text-gray-100" />
					</div>
					<div className="flex-col">
						<h1 className="text-lg text-gray-100">Login cancelled</h1>
						<p className="text-sm text-gray-500">You can return to your CLI.</p>
					</div>
				</div>
			) : (
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
							{code?.split("").map((char, i) => (
								<CodeCharacter char={char} key={`${char}-${i}`} />
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
								<Button variant="outline" onClick={() => cancel(_redirect)}>
									Cancel
								</Button>
							</div>
						</div>
					</div>
				</div>
			)}
			<Toaster />
		</div>
	);
}
