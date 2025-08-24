import { motion, useScroll, useTransform } from "framer-motion";
import React from "react";
import type { Price } from "../../types/market";
import { marketCapToStr } from "../../utils/formatting";

interface PriceTagProps {
  price: Price;
  length: number;
}

export function PriceTag({ price, length }: PriceTagProps) {
  const ref = React.useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
  });

  const translate = length > 10 ? -100 : 0;

  const opacity = useTransform(scrollYProgress, [0.98, 1], [1, 0.5]);
  const translateX = useTransform(scrollYProgress, [0.98, 1], [0, translate]);
  const scale = useTransform(scrollYProgress, [0.98, 1], [1, 0.98]);

  return (
    <motion.div
      ref={ref}
      style={{
        opacity,
        translateX,
        scale,
      }}
      transition={{ type: "spring", stiffness: 100 }}
      animate={{}}
      className="p-1 flex flex-row justify-around sm:justify-center items-center hover:bg-slate-200 dark:hover:bg-slate-500 rounded-md m-2 transition duration-100 w-10/12 sm:w-3/5 lg:w-1/2"
    >
      <div className="rounded-full scale-90 sm:scale-100 m-1 mr-2 h-10 w-10 flex items-center justify-center bg-slate-300 dark:bg-slate-600 text-slate-800 dark:text-slate-100">
        {price.symbol.slice(0, 3).toUpperCase()}
      </div>
      <div className="flex flex-col p-2 transition duration-500 delay-100 w-[50vw] justify-center items-start">
        <span className="flex flex-row w-full justify-between">
          <span className="flex flex-col justify-center text-base truncate text-right transition duration-100">
            {price.name}
          </span>
          <span className="flex flex-col justify-center text-xs text-right px-1">
            {price.symbol}
          </span>
        </span>
        <div className="flex flex-row items-center justify-between w-full">
          <span className="text-sm basis-1/2 xl:basis-1/3">
            {price.price}
            <span className="text-xs px-1">usd</span>
          </span>
          <div className="flex flex-row justify-end md:justify-between basis-1/2 xl:basis-2/3">
            <span className="hidden xl:inline-block px-1">
              <span>Market Cap: </span>
              <span className="text-xs">
                {marketCapToStr(price.market_cap)}
                <span className="text-xs px-1">usd</span>
              </span>
            </span>
            <span className="hidden md:inline-block px-1">
              <span
                className={`${
                  parseFloat(price.percent_change_24h.toString()) > 0
                    ? "text-green-400"
                    : "text-red-600"
                }`}
              >
                {parseFloat(price.percent_change_24h.toString()) > 0 ? "+" : ""}
                {price.percent_change_24h}%
              </span>
              <span className="text-xs"> /d</span>
            </span>
            <span className="px-1">
              <span
                className={`${
                  parseFloat(price.percent_change_1h.toString()) > 0
                    ? "text-green-400"
                    : "text-red-600"
                }`}
              >
                {parseFloat(price.percent_change_1h.toString()) > 0 ? "+" : ""}
                {price.percent_change_1h}%
              </span>
              <span className="text-xs"> /hr</span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}