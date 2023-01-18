import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import React from "react";
import Image from "next/image";
import { TiArrowForwardOutline } from "react-icons/ti";
import PriceImage from "../../public/blockchain_icon/blockchain_08.png";

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

  // const isInView = useInView(ref, { once: true });

  const { scrollYProgress } = useScroll({
    target: ref,
  });

  const opacity = useTransform(scrollYProgress, [0.95, 1], [1, 0.5]);
  const translateX = useTransform(scrollYProgress, [0.95, 1], [0, -150]);
  const scale = useTransform(scrollYProgress, [0.95, 1], [1, 0.95]);

  const price = props.price;
  return (
    <motion.div
      ref={ref}
      style={{
        opacity,
        translateX,
        scale,
      }}
      animate={{}}
      className="p-1 flex flex-row justify-center items-center hover:bg-slate-200 dark:hover:bg-slate-500 rounded-md m-2 transition duration-100"
      key={price.symbol}
    >
      <div className="rounded-full overflow-hidden scale-90 sm:scale-100 m-1 mr-2">
        <Image
          src={props.image}
          alt={`${price.symbol.toLowerCase()}`}
          width={40}
          height={40}
        />
      </div>
      <div
        className={`flex flex-col p-2 transition duration-500 delay-100 w-[50vw] justify-center items-start`}
      >
        <span className="flex flex-row w-full justify-between">
          <span
            className={`flex flex-col justify-center text-base truncate text-right transition duration-100`}
          >
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
};

const PriceItems = (props: { prices: Prices[] }) => {
  const prices = props.prices;

  const pricesComponents = prices.map((price: Prices, i: number) => {
    // if image is not found, use local image
    let image = require(`../../public/icon/${price.symbol.toLowerCase()}.png`);

    return <PriceTag price={price} image={image} key={i} />;
  });

  return <>{pricesComponents}</>;
};

const Prices = (props: { assets: Prices[] }): JSX.Element => {
  const sortedPrices = qSortPrices(props.assets, 0, props.assets.length - 1);
  const prices = sortedPrices;

  return (
    <div
      className={`flex flex-col justify-center items-center w-full transition py-20 min-h-screen duration-1000 delay-100`}
      id="prices"
    >
      <div className="flex flex-row text-center w-[80vw]">
        <div className="basis-1/12 md:basis-1/6"></div>
        <div className="basis-10/12 md:basis-4/6 flex flex-col justify-center items-center">
          {" "}
          <div className="flex flex-row items-center justify-center">
            <div className="h-[30px] w-[30px] md:h-[35px] md:w-[35px] xl:h-[40px] xl:w-[40px]">
              <Image src={PriceImage} alt="prices" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl p-8">Prices</h1>
            <div className="h-[30px] w-[30px] md:h-[35px] md:w-[35px] xl:h-[40px] xl:w-[40px]">
              <Image src={PriceImage} alt="prices" />
            </div>
          </div>
          <a
            className="hover:text-red-500 hover:cursor-pointer"
            href="/sources"
          >
            My Crypto Icons Sources
          </a>
        </div>
      </div>
      <AnimatePresence>
        <PriceItems prices={prices} />
      </AnimatePresence>
      <span className="text-base md:text-xl flex flex-row justify-center items-center mt-8">
        Want more? Go to{" "}
        <a
          href="https://www.tradingview.com/"
          className="hover:text-[#e87e51] mx-1"
        >
          TradingView
        </a>{" "}
        <TiArrowForwardOutline className="inline text-xl" />
      </span>
    </div>
  );
};

export default Prices;
