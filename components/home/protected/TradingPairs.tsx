import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const TradingIdeas = (props: { tradingPairs: string[] }): JSX.Element => {
  const pairs = props.tradingPairs.map((pair: string) => {
    // get rid of the -usdt part of the symbol
    const symbol = pair.split("-")[0];
    let image;

    // try get the image for the symbol
    try {
      image = require(`../../../public/icon/${symbol}.png`);
    } catch (err) {
      image = require(`../../../public/icon/default.png`);
    }

    return (
      <div key={pair}>
        <div className="text-center rounded-xl p-8 m-1 text-base sm:text-lg text-slate-700 hover:text-slate-100 hover:bg-slate-600 dark:hover:bg-slate-100 dark:text-slate-200 dark:hover:text-slate-800 transition duration-100">
          <span className="flex flex-row justify-center items-center ">
            <div className="rounded-full overflow-hidden m-1 mr-2">
              <Image src={image} alt={`${symbol}`} width={40} height={40} />
            </div>
            <a
              href={`/protected/ideas_home/${pair}`}
              className="hover:underline"
            >
              {pair.toUpperCase()}
            </a>
          </span>
        </div>
      </div>
    );
  });

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-5xl md:text-6xl lg:text-7xl p-4 m-4">
        Trading Ideas
      </h1>
      <p className="text-3xl md:text-4xl lg:text-5xl">
        Trading pairs that I have ideas for
      </p>
      <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 text-sm p-4 m-20 bg-slate-200 dark:bg-[#364b56] rounded-xl">
        {pairs}
      </motion.div>
    </div>
  );
};

export default TradingIdeas;
