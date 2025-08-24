"use client";
import { motion } from "framer-motion";
import { Card, Tabs, Tab } from "@heroui/react";
import Image from "next/image";
import AnimatedText from "../general/AnimatedText";

const previewTabs = [
  {
    key: "journal",
    title: "Journal",
    imageSrc: "/screenshots/trading_journal.gif",
    imageAlt: "Journal preview",
    unoptimized: true
  },
  {
    key: "prices", 
    title: "Prices",
    imageSrc: "/screenshots/Prices.png",
    imageAlt: "Prices preview",
    unoptimized: false
  },
  {
    key: "news",
    title: "News", 
    imageSrc: "/screenshots/News.png",
    imageAlt: "News preview",
    unoptimized: false
  }
];

export function ProductPreviewTabs() {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-6xl">
        <Tabs aria-label="Product preview" variant="underlined" className="w-full">
          {previewTabs.map(({ key, title, imageSrc, imageAlt, unoptimized }) => (
            <Tab key={key} title={<AnimatedText text={title} />}>
              <motion.div 
                initial={{ opacity: 0, y: 8 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.4 }}
              >
                <Card className="overflow-hidden border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur">
                  <div className="relative h-72 md:h-96">
                    <Image 
                      src={imageSrc} 
                      alt={imageAlt} 
                      fill 
                      unoptimized={unoptimized}
                      className="object-cover" 
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent dark:from-black/60" />
                  </div>
                </Card>
              </motion.div>
            </Tab>
          ))}
        </Tabs>
      </div>
    </section>
  );
}