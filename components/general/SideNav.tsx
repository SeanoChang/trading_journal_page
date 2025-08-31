"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { FiGrid, FiRss, FiEdit3, FiBookOpen, FiLogOut, FiCompass, FiPaperclip, FiSettings, FiUser, FiKey } from "react-icons/fi";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Avatar } from "@heroui/react";
import { useSession } from "next-auth/react";

const links = [
  { href: "/dashboard", label: "Dashboard", Icon: FiGrid },
  { href: "/news", label: "News", Icon: FiRss },
  { href: "/trades", label: "Trades", Icon: FiPaperclip },
  { href: "/ideas", label: "Ideas", Icon: FiEdit3 },
  { href: "/explore", label: "Explore", Icon: FiCompass },
  { href: "/sources", label: "Resources", Icon: FiBookOpen }
];

export default function SideNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  return (
<aside className="hidden md:flex md:flex-col md:w-60 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur md:sticky md:top-0 md:h-screen">
      <nav className="p-4 space-y-1">
        {links.map(({ href, label, Icon }) => {
          const active = pathname === href || (href !== "/protected" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/70"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto p-4">
        <Dropdown placement="top-start">
          <DropdownTrigger>
            <Button 
              variant="light" 
              className="w-full justify-start gap-3 px-3 py-2 h-auto text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 border-none"
            >
              <Avatar
                size="sm"
                icon={<FiUser />}
                classNames={{
                  base: "bg-slate-200 dark:bg-slate-700",
                  icon: "text-slate-600 dark:text-slate-300"
                }}
              />
              <span className="truncate">{session?.user?.name || session?.user?.email || "User"}</span>
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Navigation menu">
            <DropdownItem 
              key="settings" 
              startContent={<FiSettings className="h-4 w-4" />}
              href="/settings"
            >
              Settings
            </DropdownItem>
            <DropdownItem 
              key="exchanges" 
              startContent={<FiKey className="h-4 w-4" />}
              href="/exchanges"
            >
              Exchanges
            </DropdownItem>
            <DropdownItem 
              key="signout" 
              startContent={<FiLogOut className="h-4 w-4" />}
              className="text-rose-500"
              onPress={() => signOut({ callbackUrl: "/" })}
              showDivider
            >
              Sign out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </aside>
  );
}
