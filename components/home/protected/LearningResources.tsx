import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

type Book = {
  id: number;
  title: string;
  author: string;
  link: string;
  description: string;
  progress: number;
};

const tradingBooks: Book[] = [
  {
    id: 1,
    title: "Japanese Candlestick Charting Techniques, Second Edition",
    author: "Steve Nison",
    link: "https://www.amazon.com/Japanese-Candlestick-Charting-Techniques-Second/dp/0471352072",
    description:
      "The bible of candlestick charting. This book is a must read for any trader.",
    progress: 95,
  },
  {
    id: 2,
    title: "A Complete Guide to Volume Price Analysis",
    author: "Anna Coulling",
    link: "https://www.amazon.com/Complete-Guide-Volume-Price-Analysis/dp/0471352072",
    description: "How to use volume to get the best trades.",
    progress: 30,
  },
  {
    id: 3,
    title: "Techinal Analysis of the Financial Markets",
    author: "John Murphy",
    link: "https://www.amazon.com/Technical-Analysis-Financial-Markets-Prentice/dp/0136126522",
    description:
      "Includes all basic and intermediate technical analysis concepts, good for general learning.",
    progress: 35,
  },
  {
    id: 4,
    title: "More Money Than God",
    author: "Sebastian Mallaby",
    link: "https://www.amazon.com/More-Money-Than-God-Investments/dp/0307277679",
    description: "The truth of hedge funds and the people who run them.",
    progress: 30,
  },
  {
    id: 5,
    title:
      "Option, Volatility, and Pricing: Advanced Trading Strategies and Techniques, 2nd Edition",
    author: "Sheldon Natenberg",
    link: "https://www.amazon.com/Options-Volatility-Pricing-Advanced-Strategies/dp/0133976890",
    description: "Discussion of volatility and pricing. Haven't read it yet.",
    progress: 0,
  },
  {
    id: 6,
    title:
      "Harmonic Trading: Volume 1: The Next Generation of Trading Strategies",
    author: "Scott Carney",
    link: "https://www.amazon.com/Harmonic-Trading-Generation-Strategies-Techniques/dp/047052805X",
    description: "Book for harmonic trading.",
    progress: 40,
  },
  {
    id: 7,
    title: "Market Liquidity",
    author: "Thierry Foucault, Macro Pagano, Ailsa Roell",
    link: "https://www.amazon.com/Market-Liquidity-Princeton-Studies-Financial/dp/069112295X",
    description: "Book for liquidity and price discovery.",
    progress: 0,
  },
  {
    id: 8,
    title: "The Inner Circle Trader 2022 Mentorship",
    author: "ICT",
    link: "https://www.amazon.com/Market-Liquidity-Princeton-Studies-Financial/dp/069112295X",
    description: "Orderflow concepts",
    progress: 20,
  },
  {
    id: 9,
    title: "The Inner Circle Trader 12 Months Mentorship",
    author: "ICT",
    link: "https://www.amazon.com/Market-Liquidity-Princeton-Studies-Financial/dp/069112295X",
    description: "Orderflow core concepts",
    progress: 1,
  },
];

const BookItem = (props: { book: Book }) => {
  const ref = useRef(null);
  const inView = useInView(ref, {
    once: true,
  });

  return (
    <div
      key={props.book.id}
      className="flex flex-col justify-center items-center m-4 sm:m-8 group"
    >
      <div
        className="flex flex-col p-1 sm:p-4 justify-center items-center dark:text-[#d7e7f9] text-center w-full lg:w-5/6"
        ref={ref}
      >
        <h3 className="text-base sm:text-xl font-bold">{props.book.title}</h3>
        <h4 className="text-sm sm:text-lg font-bold">{props.book.author}</h4>
        <p className="text-xs sm:text-sm">{props.book.description}</p>
        <div className="bg-gray-300 w-3/4 md:w-1/2 rounded my-4">
          <div
            style={{
              width: inView ? `${props.book.progress}%` : "0%",
              transition: "width 2s ease-in-out",
            }}
            className="bg-gradient-to-r from-[#ff0000] to-[#f7c931]  dark:from-[#d6ab36] dark:to-[#ffdc89] h-2 rounded"
          />
        </div>
      </div>
    </div>
  );
};

const LearningResources = () => {
  const bookItems = tradingBooks.map((book: Book) => (
    <BookItem key={book.id} book={book} />
  ));

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <motion.div className="text-3xl md:text-5xl lg:text-7xl my-4">
        Learning Resources
      </motion.div>
      <motion.div className="font-serif text-base md:text-xl lg:text-2xl my-4">
        Never stop studying the markets.
      </motion.div>
      <div className="bg-gradient-to-bl from-slate-100 to-slate-300 dark:bg-gradient-to-br dark:from-[#484a75] dark:to-[#161837] rounded-md p-4 m-8 flex flex-col flex-nowrap">
        {bookItems}
      </div>
    </div>
  );
};

export default LearningResources;
