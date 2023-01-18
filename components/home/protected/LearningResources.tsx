import React from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";

type book = {
  id: number;
  title: string;
  author: string;
  link: string;
  description: string;
  progress: number;
};

const tradingBooks: book[] = [
  {
    id: 1,
    title: "Japanese Candlestick Charting Techniques, Second Edition",
    author: "Steve Nison",
    link: "https://www.amazon.com/Japanese-Candlestick-Charting-Techniques-Second/dp/0471352072",
    description:
      "The bible of candlestick charting. This book is a must read for any trader.",
    progress: 0,
  },
  {
    id: 2,
    title: "A Complete Guide to Volume Price Analysis",
    author: "Anna Coulling",
    link: "https://www.amazon.com/Complete-Guide-Volume-Price-Analysis/dp/0471352072",
    description:
      "The bible of candlestick charting. This book is a must read for any trader.",
    progress: 0,
  },
  {
    id: 3,
    title: "Techinal Analysis of the Financial Markets",
    author: "John Murphy",
    link: "https://www.amazon.com/Technical-Analysis-Financial-Markets-Prentice/dp/0136126522",
    description:
      "The bible of candlestick charting. This book is a must read for any trader.",
    progress: 0,
  },
  {
    id: 4,
    title: "More Money Than God",
    author: "Sebastian Mallaby",
    link: "https://www.amazon.com/More-Money-Than-God-Investments/dp/0307277679",
    description: "The truth of hedge funds and the people who run them.",
    progress: 0,
  },
  {
    id: 5,
    title:
      "Option, Volaity, and Pricing: Advanced Trading Strategies and Techniques, 2nd Edition",
    author: "Sheldon Natenberg",
    link: "https://www.amazon.com/Options-Volatility-Pricing-Advanced-Strategies/dp/0133976890",
    description: "Book for options trading.",
    progress: 0,
  },
  {
    id: 6,
    title:
      "Harmonic Trading: Volume 1: The Next Generation of Trading Strategies",
    author: "Scott Carney",
    link: "https://www.amazon.com/Harmonic-Trading-Generation-Strategies-Techniques/dp/047052805X",
    description: "Book for harmonic trading.",
    progress: 0,
  },
  {
    id: 7,
    title: "Market Liquidity",
    author: "Thierry Foucault, Macro Pagano, Ailsa Roell",
    link: "https://www.amazon.com/Market-Liquidity-Princeton-Studies-Financial/dp/069112295X",
    description: "Book for liquidity.",
    progress: 0,
  },
  {
    id: 8,
    title: "Inner Circle Trader 2022 Mentorship",
    author: "ICT",
    link: "https://www.amazon.com/Market-Liquidity-Princeton-Studies-Financial/dp/069112295X",
    description: "Book for liquidity.",
    progress: 0,
  },
];

const LearningResources = (): JSX.Element => {
  const [resources, setResources] = React.useState([...tradingBooks]);

  const bookItems = resources.map((book) => (
    <div
      key={book.id}
      className="flex flex-col justify-center items-center bg-slate-200 rounded-lg p-4 m-8 drop-shadow hover:cursor-pointer hover:drop-shadow-lg"
    >
      <div className="flex flex-col justify-center items-center">
        <svg className="w-48 h-48">
          <circle
            cx="40"
            cy="40"
            r="35"
            pathLength="1"
            strokeWidth="10"
            stroke="#101010"
          />
          <circle
            cx="40"
            cy="40"
            r="35"
            pathLength="0.5"
            strokeWidth="10"
            stroke="#adfcd9"
          />
        </svg>
        <h3 className="text-xl font-bold">{book.title}</h3>
        <h4 className="text-lg font-bold">{book.author}</h4>
        <p className="text-sm">{book.description}</p>
      </div>
    </div>
  ));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col justify-center items-center min-h-screen"
    >
      <div className="bg-slate-100 rounded-md p-4 m-8 flex flex-row flex-nowrap">
        {bookItems}
      </div>
    </motion.div>
  );
};

export default LearningResources;
