"use client";
import { Spacer } from "@heroui/react";
import { motion } from "framer-motion";
import { useMarketData } from "../hooks/useMarketData";
import { Hero } from "../components/home/Hero";
import { Features } from "../components/home/Features";
import { ProductPreviewTabs } from "../components/home/ProductPreviewTabs";
import { FAQ } from "../components/home/FAQ";
import { Footer } from "../components/home/Footer";

export default function HomeClient() {
  const { market, loading } = useMarketData();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-slate-200 dark:from-[#0b0b16] dark:to-[#18182b] text-slate-800 dark:text-slate-100">
      {/* Subtle grid overlay */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.04] dark:opacity-[0.06]" aria-hidden>
        <defs>
          <pattern id="grid-landing" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-landing)" />
      </svg>
      {/* Glow accents */}
      <motion.div aria-hidden initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/40 dark:bg-white/5 blur-2xl" />
      <motion.div aria-hidden initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-white/40 dark:bg-white/5 blur-3xl" />
      {/* Top navigation moved to RootLayout */}

      <main className="relative z-10 px-6 md:px-10 lg:px-16">
        <Hero market={market} loading={loading} />
        <Features />
        <ProductPreviewTabs />
        <FAQ />
        <Spacer y={8} />
      </main>

      <Footer />
    </div>
  );
}
