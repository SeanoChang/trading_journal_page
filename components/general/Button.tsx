import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const Button = (props: { onclick: any; text: string }) => {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
  });

  const opacity = useTransform(scrollYProgress, [1, 0.8], [0, 1]);
  const scale = useTransform(scrollYProgress, [1, 0.8], [0.5, 1.2]);

  return (
    <motion.div
      ref={ref}
      style={{
        opacity,
        scale,
      }}
      className="text-3xl sm:text-5xl lg:text-7xl font-bold hover:bg-gradient-to-br hover:from-[#f3ec14] hover:to-[#ff2e2e] hover:bg-clip-text hover:text-transparent p-2"
    >
      <button onClick={props.onclick}>{props.text}</button>
    </motion.div>
  );
};

export default Button;
