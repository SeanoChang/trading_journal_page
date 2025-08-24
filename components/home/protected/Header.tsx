import React from "react";
import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";

const Header = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 1 }}
      className="h-[60vh] flex flex-col justify-center items-center text-center"
    >
      <h1 className="text-4xl md:text-6xl lg:text-9xl font-bold">
        Trading Ideas
      </h1>
      <div className="font-serif text-base md:text-xl lg:text-2xl p-2 mx-1 my-8">
        <Typewriter
          onInit={(typewriter) => {
            typewriter
              .typeString("Not a good trader yet, but I'm getting there!")
              .pauseFor(2500)
              .deleteAll()
              .typeString("Welcome to my journey!")
              .pauseFor(2500)
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
    </motion.div>
  );
};

export default Header;
