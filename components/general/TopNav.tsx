"use client";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Link, Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { useSession, signIn, signOut } from "next-auth/react";
import AnimatedText from "../general/AnimatedText";

export default function TopNav() {
  const { data: session, status } = useSession();
  const authed = status === "authenticated";
  const user = session?.user;
  return (
    <Navbar maxWidth="xl" isBordered className="backdrop-blur bg-background/70">
      <NavbarBrand>
        <Link href="/" className="flex items-center gap-2">
          <AnimatedText text="Seano’s Trading" className="text-base md:text-lg font-semibold" />
        </Link>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>
          <Link href="/news" className="text-sm md:text-base">
            <AnimatedText text="News" />
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/protected" className="text-sm md:text-base">
            <AnimatedText text="Dashboard" />
          </Link>
        </NavbarItem>
        {!authed && (
          <NavbarItem>
            <Button color="primary" size="sm" onPress={() => signIn(undefined, { callbackUrl: "/protected" })}>
              <AnimatedText text="Sign in" />
            </Button>
          </NavbarItem>
        )}
        {authed && (
          <NavbarItem className="flex items-center gap-2">
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  as="button"
                  size="sm"
                  className="transition-transform"
                  name={user?.name || "User"}
                  src={(user as any)?.image || undefined}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="User menu" variant="flat">
                <DropdownItem key="profile" className="h-12" textValue="profile">
                  <div className="flex flex-col">
                    <span className="text-small">Signed in as</span>
                    <span className="text-small font-semibold">{user?.email || user?.name}</span>
                  </div>
                </DropdownItem>
                <DropdownItem key="dashboard" as={Link} href="/protected" textValue="dashboard">
                  Dashboard
                </DropdownItem>
                <DropdownItem key="signout" color="danger" onPress={() => signOut({ callbackUrl: "/" })} textValue="signout">
                  Sign out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        )}
      </NavbarContent>
    </Navbar>
  );
}
