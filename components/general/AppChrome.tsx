"use client";
import { useSession } from "next-auth/react";
import TopNav from "./TopNav";
import SideNav from "./SideNav";
import MobileSideNav from "./MobileSideNav";
import type { ReactNode } from "react";
import { useState } from "react";
import { FiMenu } from "react-icons/fi";

export default function AppChrome({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const authed = status === "authenticated";
  const [open, setOpen] = useState(false);

  if (authed) {
    return (
      <div className="min-h-screen flex">
        <SideNav />
        <div className="flex-1 min-w-0">
          <div className="md:hidden sticky top-0 z-40 flex items-center gap-2 h-12 px-3 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 backdrop-blur">
            <button aria-label="Open menu" onClick={() => setOpen(true)} className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
              <FiMenu />
            </button>
            <span className="text-sm font-medium">Menu</span>
          </div>
          {children}
        </div>
        <MobileSideNav open={open} onClose={() => setOpen(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
