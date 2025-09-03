"use client";
import { Link } from "@heroui/react";
import { signIn } from "next-auth/react";
import { FiGithub, FiTwitter, FiMail } from "react-icons/fi";
import AnimatedText from "../general/AnimatedText";
import { footerLinks, socialLinks } from "../../constants/navigation";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur">
      <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-slate-900 dark:bg-white" />
          <AnimatedText
            as="span"
            className="font-semibold"
            text="Seano's Trading"
          />
        </div>
        <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-300">
          {footerLinks.map(({ href, label }) => (
            <Link key={href} href={href}>
              <AnimatedText text={label} />
            </Link>
          ))}
          <button className="underline" onClick={() => signIn()}>
            <AnimatedText text="Sign in" />
          </button>
        </div>
        <div className="flex items-center gap-4 text-slate-600 dark:text-slate-300">
          {socialLinks.map(({ href, ariaLabel }, index) => {
            const IconComponent = [FiGithub, FiTwitter, FiMail][index];
            return (
              <a
                key={href}
                href={href}
                aria-label={ariaLabel}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
              >
                <IconComponent />
              </a>
            );
          })}
        </div>
      </div>
      <div className="text-center text-xs text-slate-500 dark:text-slate-400 pb-6">
        <AnimatedText
          text={`© ${new Date().getFullYear()} SeanoChang. All rights reserved.`}
          step={0.008}
        />
      </div>
    </footer>
  );
}
