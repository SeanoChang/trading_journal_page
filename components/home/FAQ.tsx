"use client";
import { Accordion, AccordionItem } from "@heroui/react";
import AnimatedText from "../general/AnimatedText";

const faqItems = [
  {
    key: "1",
    question: "Is it free?",
    answer: "Yes. Use it free, and sign in to unlock protected features."
  },
  {
    key: "2", 
    question: "Where do prices come from?",
    answer: "Server-side quotes via CoinMarketCap, delivered through `/api/prices` and refreshed on the client."
  },
  {
    key: "3",
    question: "What is MDX?",
    answer: "Markdown with components. Write rich notes, embed context, and review with clarity."
  },
  {
    key: "4",
    question: "Can I export my notes?", 
    answer: "Notes are MDX files. Copy or export them whenever you like."
  }
];

export function FAQ() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-8">
          <AnimatedText as="h2" className="text-3xl font-bold" text="FAQ" />
          <AnimatedText 
            as="p" 
            className="mt-2 text-slate-600 dark:text-slate-300" 
            text="Quick answers to common questions." 
            delay={0.4} 
          />
        </div>
        <Accordion selectionMode="multiple" variant="splitted">
          {faqItems.map(({ key, question, answer }) => (
            <AccordionItem 
              key={key} 
              aria-label={question} 
              title={<AnimatedText text={question} />}
            >
              <AnimatedText text={answer} />
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}