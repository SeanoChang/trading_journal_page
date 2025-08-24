import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { TiArrowForwardOutline } from "react-icons/ti";
import type { Price } from "../../types/market";
import { qSortPrices } from "../../utils/sorting";
import { PriceItems } from "../prices/PriceItems";

const Prices = (props: { assets: Price[] }) => {
  const sortedPrices = qSortPrices([...props.assets], 0, props.assets.length - 1);
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
          <div className="flex flex-row items-center justify-center gap-4">
            <span className="text-2xl">💰</span>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl p-4">Prices</h1>
            <span className="text-2xl">💰</span>
          </div>
          <Link
            className="hover:text-red-500 hover:cursor-pointer"
            href="/sources"
          >
            My Crypto Icons Sources
          </Link>
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
