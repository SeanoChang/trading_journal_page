import {
  motion,
  Reorder,
  useScroll,
  useTransform,
  AnimatePresence,
  useInView,
} from "framer-motion";
import React, { useState, useEffect } from "react";
import { BsChevronExpand, BsChevronContract } from "react-icons/bs";
import Image from "next/image";
import { once } from "events";

type Prices = {
  name: string;
  symbol: string;
  price: number;
  percent_change_1h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  market_cap: number;
  volume_24h: number;
  time_stamp: string;
};

const findPivot = (prices: Prices[], lb: number, ub: number): number => {
  let pivot = parseFloat(prices[ub].market_cap.toString()); // set pivot to last element

  let i = lb - 1; // set i to one less than lower bound
  for (let j = lb; j < ub; j++) {
    // if element is less than pivot
    // swap i and j elements
    // parse float to avoid string comparison
    if (parseFloat(prices[j].market_cap.toString()) > pivot) {
      i++;
      [prices[i], prices[j]] = [prices[j], prices[i]];
    }
  }

  // swap i+1 with pivot
  [prices[i + 1], prices[ub]] = [prices[ub], prices[i + 1]];

  return i + 1;
};

const qSortPrices = (prices: Prices[], lb: number, ub: number): Prices[] => {
  if (lb === ub) return prices;
  if (lb > ub) return [];

  const pivot = findPivot(prices, lb, ub);
  //qsort left side
  qSortPrices(prices, lb, pivot - 1);
  //qsort right side
  qSortPrices(prices, pivot + 1, ub);

  return prices;
};

const marketCapToStr = (marketCap: number): string => {
  if (marketCap < 1000000) {
    return (marketCap / 1000).toFixed(2) + "K";
  } else if (marketCap < 1000000000) {
    return (marketCap / 1000000).toFixed(2) + "M";
  } else {
    return (marketCap / 1000000000).toFixed(2) + "B";
  }
};

const PriceTag = (props: { price: Prices; image: any }) => {
  const ref = React.useRef(null);

  const isInView = useInView(ref, { once: true });

  // const { scrollYProgress } = useScroll({
  //   target: ref,
  // });

  // const opacity = useTransform(scrollYProgress, [0, 1], [2, 0.3]);
  // const translateX = useTransform(scrollYProgress, [0.8, 1], [0, -500]);
  // const scale = useTransform(scrollYProgress, [0.8, 1], [1, 0.8]);

  const price = props.price;
  return (
    <motion.div
      ref={ref}
      style={{
        opacity: isInView ? 1 : 0,
        translateX: isInView ? 0 : -500,
        scale: isInView ? 1 : 0.8,
        transition: "all 1s ease-in-out",
      }}
      animate={{}}
      className="p-1 drop-shadow-md flex flex-row justify-center items-center flex-none  bg-gray-200 rounded-md m-4"
    >
      <div className="rounded-full overflow-hidden w-[40px] h-[40px] m-1 mr-2">
        <Image
          src={props.image}
          alt={`${price.symbol.toLowerCase()}`}
          width={40}
          height={40}
        />
      </div>
      <div
        className={`flex flex-col p-2 hover:cursor-pointer transition duration-500 delay-100 w-[50vw] justify-center items-start`}
      >
        <span className="flex flex-row w-full justify-between">
          <span
            className={`flex flex-col justify-center text-base text-right transition duration-100`}
          >
            {price.name}
          </span>
          <span className="flex flex-col justify-center text-xs text-right">
            {price.symbol}
          </span>
        </span>
        <div className="flex flex-row items-center justify-between w-full">
          <span className="text-sm lg:basis-1/3 xl:basis-1/2">
            {price.price}
            <span className="text-xs px-1">usd</span>
          </span>
          <div className="flex flex-row justify-between lg:basis2/3 xl:basis-1/2">
            <span className="hidden lg:inline-block">
              <span>Market Cap: </span>
              <span className="text-xs">
                {marketCapToStr(price.market_cap)}
                <span className="text-xs px-1">usd</span>
              </span>
            </span>
            <span className="hidden md:inline-block">
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
            <span>
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
};

const PriceItems = (props: { prices: Prices[] }) => {
  const prices = props.prices;

  const pricesComponents = prices.map((price: Prices) => {
    // if image is not found, use local image
    let image = require(`../../public/icon/${price.symbol.toLowerCase()}.png`);

    // if image still not found, use default image
    if (image === undefined) {
      image = require(`../../public/icon/default.png`);
    }

    return (
      <Reorder.Item key={price.symbol} value={price}>
        <PriceTag price={price} image={image} />
      </Reorder.Item>
    );
  });

  return <>{pricesComponents}</>;
};

const Prices = (props: { assets: Prices[] }): JSX.Element => {
  const sortedPrices = qSortPrices(props.assets, 0, props.assets.length - 1);
  const [prices, setPrices] = useState([...sortedPrices]);

  return (
    <div
      className={`flex flex-col justify-center items-center w-screen transition m-20 min-h-screen duration-1000 delay-100`}
    >
      <div className="flex flex-row text-center w-[80vw]">
        <div className="basis-1/6"></div>
        <div className="basis-4/6 flex flex-col justify-center items-center">
          {" "}
          <h1 className="text-3xl sm:text-4xl lg:text-6xl p-8">Prices</h1>
        </div>
      </div>
      <AnimatePresence>
        <Reorder.Group
          axis="y"
          values={prices}
          onReorder={setPrices}
          className={`flex flex-col justify-center items-center`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 1 }}
        >
          <PriceItems prices={prices} />
        </Reorder.Group>
      </AnimatePresence>
    </div>
  );
};

export default Prices;
