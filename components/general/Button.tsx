import React, { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const Button = (props: { onclick: any; text: string }): JSX.Element => {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
  });

  const opacity = useTransform(scrollYProgress, [0.5, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.5, 0.5]);

  return (
    <motion.div
      ref={ref}
      style={{
        opacity,
        scale,
      }}
      className="text-3xl md:text-5xl lg:text-7xl font-bold"
    >
      <button onClick={props.onclick}>{props.text}</button>
    </motion.div>
  );
};

export default Button;
