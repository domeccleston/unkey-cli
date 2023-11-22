import Image from "next/image";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="min-h-screen flex w-full">
      <UserButton afterSignOutUrl="/" />
    </main>
  );
}
