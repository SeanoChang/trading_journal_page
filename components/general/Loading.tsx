import { motion } from "framer-motion";

const Loading = (): JSX.Element => {
  return (
    <div className="flex flex-col justify-center items-center h-[50vh]">
      <svg className="w-[150px] h-[210px] flex flex-col justify-center items-center">
        <motion.polyline
          points="5,200 20,100 50,130 65,40 100,150 120,80 150,250"
          className="fill-none stroke-current text-[#539b66] stroke-[3px]"
          initial={{ pathLength: 0 }}
          animate={{
            pathLength: 1,
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
            repeatDelay: 1,
          }}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default Loading;
