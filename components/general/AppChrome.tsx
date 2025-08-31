"use client";
import { useSession } from "next-auth/react";
import TopNav from "./TopNav";
import type { ReactNode } from "react";

export default function AppChrome({ children }: { children: ReactNode }) {
  const { status } = useSession();

  return (
    <div className="min-h-screen flex flex-col">
      {status === "unauthenticated" && <TopNav />}
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
