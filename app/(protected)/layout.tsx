"use client";
import SideNav from "../../components/general/SideNav";
import MobileSideNav from "../../components/general/MobileSideNav";
import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import type { ReactNode } from "react";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

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