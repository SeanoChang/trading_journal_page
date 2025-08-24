"use client";
import { useEffect, useMemo, useState } from "react";
import { getProviders, signIn } from "next-auth/react";
import Image from "next/image";
import { Card, CardBody, Button, Divider, Chip, Skeleton } from "@heroui/react";
import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import {
  FaGoogle,
  FaGithub,
  FaDiscord,
  FaMicrosoft,
  FaApple,
  FaTwitter,
  FaLinkedin,
  FaFacebook,
  FaReddit,
  FaUserCircle,
} from "react-icons/fa";

type Provider = {
  id: string;
  name: string;
};

const providerIcons: Record<string, IconType> = {
  google: FaGoogle,
  github: FaGithub,
  discord: FaDiscord,
  microsoft: FaMicrosoft,
  "azure-ad": FaMicrosoft,
  apple: FaApple,
  twitter: FaTwitter,
  x: FaTwitter,
  linkedin: FaLinkedin,
  facebook: FaFacebook,
  reddit: FaReddit,
};

function getIconForProvider(provider: Provider): IconType {
  const key = provider.id?.toLowerCase?.() || provider.name?.toLowerCase?.();
  return (key && providerIcons[key]) || FaUserCircle;
}

export default function SignInPage() {
  const [providers, setProviders] = useState<Record<string, Provider> | null>(
    null
  );

  useEffect(() => {
    getProviders().then((prov) => setProviders(prov));
  }, []);

  const items = useMemo(() => (providers ? Object.values(providers) : []), [
    providers,
  ]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-50 dark:bg-black">
      {/* Subtle grid background */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06] dark:opacity-[0.08]"
        aria-hidden
      >
        <defs>
          <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Animated gradient blobs */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="pointer-events-none absolute -top-40 -right-32 h-80 w-80 rounded-full bg-gradient-to-tr from-neutral-200 to-white dark:from-neutral-900 dark:to-neutral-800 blur-2xl"
      />
      <motion.div
        aria-hidden
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-gradient-to-tl from-neutral-200 to-white dark:from-neutral-900 dark:to-neutral-800 blur-2xl"
      />

      <div className="relative z-10 grid min-h-screen grid-cols-1 items-center gap-8 p-6 sm:p-10 lg:grid-cols-2">
        {/* Left: Card & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md mx-auto"
        >
          <Card radius="lg" shadow="sm" className="border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md">
            <CardBody className="p-6 sm:p-8">
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                  Welcome back
                </h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Sign in to your trading journal, price dashboard, and curated news feed.
                </p>
              </div>

              <Divider className="my-5" />

              {/* Providers */}
              {!providers && (
                <div className="space-y-3">
                  <Skeleton className="h-11 rounded-xl" />
                  <Skeleton className="h-11 rounded-xl" />
                </div>
              )}
              {providers && (
                <div className="flex flex-col gap-3">
                  {items.map((provider) => {
                    const Icon = getIconForProvider(provider);
                    return (
                      <Button
                        key={provider.id}
                        size="md"
                        radius="lg"
                        variant="flat"
                        className="justify-start border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80"
                        startContent={<Icon className="h-5 w-5" />}
                        onPress={() => signIn(provider.id, { callbackUrl: "/protected" })}
                        aria-label={`Sign in with ${provider.name}`}
                      >
                        {provider.name}
                      </Button>
                    );
                  })}
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-2">
                <Chip size="sm" variant="flat" className="bg-neutral-100 dark:bg-neutral-800">
                  Journal
                </Chip>
                <Chip size="sm" variant="flat" className="bg-neutral-100 dark:bg-neutral-800">
                  Prices
                </Chip>
                <Chip size="sm" variant="flat" className="bg-neutral-100 dark:bg-neutral-800">
                  News
                </Chip>
                <Chip size="sm" variant="flat" className="bg-neutral-100 dark:bg-neutral-800">
                  Resources
                </Chip>
              </div>

              <p className="mt-4 text-center text-xs text-neutral-500 dark:text-neutral-400">
                By continuing you agree to the terms.
              </p>
            </CardBody>
          </Card>
        </motion.div>

        {/* Right: Preview panel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="relative hidden w-full items-center justify-center lg:flex"
        >
          <div className="relative h-[420px] w-[560px]">
            <div className="absolute inset-0 overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-md shadow-lg">
              <Image
                src="/screenshots/trading_journal.gif"
                alt="Trading journal preview"
                fill
                priority
                unoptimized
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-transparent dark:from-black/60" />
            </div>
            {/* Floating mini preview */}
            <motion.div
              initial={{ opacity: 0, y: 10, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
              className="absolute -bottom-6 -left-6 hidden h-40 w-56 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md shadow-md md:block"
            >
              <Image
                src="/screenshots/Prices.png"
                alt="Prices preview"
                fill
                className="object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10, rotate: 2 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
              className="absolute -top-6 -right-6 hidden h-36 w-48 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md shadow-md md:block"
            >
              <Image
                src="/screenshots/News.png"
                alt="News preview"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
