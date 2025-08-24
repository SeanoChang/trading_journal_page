"use client";
import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { FiGrid, FiRss, FiEdit3, FiBookOpen, FiLogOut, FiX } from "react-icons/fi";

const links = [
  { href: "/protected", label: "Dashboard", Icon: FiGrid },
  { href: "/news", label: "News", Icon: FiRss },
  { href: "/protected/ideas", label: "Ideas", Icon: FiEdit3 },
  { href: "/sources", label: "Resources", Icon: FiBookOpen },
];

export default function MobileSideNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div className={`md:hidden fixed inset-0 z-50 transition ${open ? "pointer-events-auto" : "pointer-events-none"}`} aria-hidden={!open}>
      <div className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
      <div className={`absolute inset-y-0 left-0 w-64 max-w-[80vw] bg-white dark:bg-slate-900 shadow-xl p-4 transform transition-transform ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold">Menu</span>
          <button aria-label="Close menu" onClick={onClose} className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
            <FiX />
          </button>
        </div>
        <nav className="space-y-1">
          {links.map(({ href, label, Icon }) => {
            const active = pathname === href || (href !== "/protected" && pathname.startsWith(href));
            return (
              <Link key={href} href={href} onClick={onClose} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${active ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/70"}`}>
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button onClick={() => signOut({ callbackUrl: "/" })} className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30">
            <FiLogOut className="h-4 w-4" />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
