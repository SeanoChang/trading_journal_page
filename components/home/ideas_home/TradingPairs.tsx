import React from "react";
import { motion } from "framer-motion";
type pair = {
  from: string;
  to: string;
};

// list of trading pairs that I have ideas for
/*
btc/usdt, eth/usdt, bnb/usdt, ada/usdt, xrp/usdt, dot/usdt, aave/usdt, ape/usdt, atom/usdt, 
etc/usdt, chz/usdt, ens/usdt, dydx/usdt, sushi/usdt, near/usdt, apt/usdt, sol/usdt, avax/usdt,
*/

const tradingPairs = [
  { from: "BTC", to: "USDT" },
  { from: "ETH", to: "USDT" },
  { from: "BNB", to: "USDT" },
  { from: "ADA", to: "USDT" },
  { from: "XRP", to: "USDT" },
  { from: "DOT", to: "USDT" },
  { from: "AAVE", to: "USDT" },
  { from: "APE", to: "USDT" },
  { from: "ATOM", to: "USDT" },
  { from: "ETC", to: "USDT" },
  { from: "CHZ", to: "USDT" },
  { from: "ENS", to: "USDT" },
  { from: "DYDX", to: "USDT" },
  { from: "SUSHI", to: "USDT" },
  { from: "NEAR", to: "USDT" },
  { from: "APT", to: "USDT" },
  { from: "SOL", to: "USDT" },
  { from: "AVAX", to: "USDT" },
];

const TradingIdeas = (): JSX.Element => {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-5xl md:text-6xl lg:text-7xl p-4 m-4">Trading Ides</h1>
      <p className="text-3xl md:text-4xl lg:text-5xl">
        Trading pairs that I have ideas for
      </p>
      <motion.div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 text-sm p-4 m-20 bg-stone-300 rounded-xl">
        {tradingPairs.map((pair: pair) => {
          return (
            <div className="bg-stone-400 rounded-xl drop-shadow-md hover:drop-shadow-lg p-2 m-8">
              {pair.from}/{pair.to}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default TradingIdeas;
