import { FiHome, FiTrendingUp, FiEdit3, FiRss } from "react-icons/fi";
import type { IconType } from "react-icons";

export interface NavLink {
  href: string;
  label: string;
  icon: IconType;
}

export const linkIcons: NavLink[] = [
  {
    href: "/",
    label: "Home",
    icon: FiHome,
  },
  {
    href: "/protected",
    label: "Dashboard",
    icon: FiTrendingUp,
  },
  {
    href: "/protected/ideas_home",
    label: "Journal",
    icon: FiEdit3,
  },
  {
    href: "/news",
    label: "News",
    icon: FiRss,
  },
];

export const footerLinks = [
  { href: "/news", label: "News" },
  { href: "/protected", label: "Dashboard" },
] as const;

export const socialLinks = [
  { href: "https://github.com", label: "GitHub", ariaLabel: "GitHub" },
  { href: "https://twitter.com", label: "Twitter", ariaLabel: "Twitter" },
  { href: "mailto:hello@example.com", label: "Email", ariaLabel: "Email" },
] as const;
