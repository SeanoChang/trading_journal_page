import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Typewriter from "typewriter-effect";

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
        <div className="flex flex-row justify-center items-center text-center w-full sm:w-[268px] md:w-48 rounded-xl p-5 m-1 text-teal-700 hover:text-teal-100 hover:bg-[#62aa7f] dark:hover:bg-teal-100 dark:text-teal-200 dark:hover:text-teal-800 transition duration-100">
          <span className="flex flex-row justify-center items-center">
            <div className="rounded-full overflow-hidden m-1 mr-2">
              <Image src={image} alt={`${symbol}`} width={40} height={40} />
            </div>
            <a
              href={`/protected/ideas_home/${pair}`}
              className="hover:underline"
            >
              {pair.toUpperCase().split("-")[0]}
            </a>
          </span>
        </div>
      </div>
    );
  });

  return (
    <div className="flex flex-col justify-center items-center my-72">
      <h1 className="text-3xl md:text-5xl lg:text-7xl my-4">
        Thoughts and Ideas
      </h1>
      <div className="font-serif text-base md:text-xl lg:text-2xl p-2 mx-1 mt-2">
        <Typewriter
          onInit={(typewriter) => {
            typewriter
              .typeString("Take a look and see what I'm thinking!")
              .pauseFor(2500)
              .deleteChars(22)
              .typeString("give me some feedback!")
              .pauseFor(5000)
              .deleteAll()
              .start();
          }}
          options={{
            loop: true,
            delay: 75,
            autoStart: true,
          }}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 w-11/12 md:w-5/6 text-base p-4 m-20 bg-gradient-to-br from-[#d1ece1] to-[#c3e4c9] dark:bg-gradient-to-bl dark:from-[#378da2] dark:to-[#1c5363] rounded-xl">
        {pairs}
      </div>
    </div>
  );
};

export default TradingIdeas;
