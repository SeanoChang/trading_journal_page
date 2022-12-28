import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion, useTime, useTransform } from "framer-motion";

function Loading() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const time = useTime();
  const opacity = useTransform(
    time,
    [0, 1000], // 1sec
    [0, 1], // 0 to 1
    { clamp: false }
  );

  useEffect(() => {
    const handleStart = (url: any) => url !== router.asPath && setLoading(true);
    const handleComplete = (url: any) =>
      url === router.asPath &&
      setTimeout(() => {
        setLoading(false);
      }, 2000);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  });

  return (
    loading && (
      <div className="flex flex-col justify-center items-center">
        <motion.span className="text-xl">Loading ...</motion.span>
      </div>
    )
  );
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
