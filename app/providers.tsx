"use client";
import { SessionProvider } from "next-auth/react";
import { HeroUIProvider } from "@heroui/react";
import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <HeroUIProvider>{children}</HeroUIProvider>
    </SessionProvider>
  );
}
