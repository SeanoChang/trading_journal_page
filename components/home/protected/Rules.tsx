import { motion } from "framer-motion";

const rules: string[] = [
  "Do not trade with emotions",
  "Set stop loss everytime",
  "Know where to exit before you enter",
  "Don't chase trades",
  "No more than 3 trades per day",
  "Zoom out before getting in",
  "Less is more",
  "Look for liquidity",
];

const Rule = (props: { rule: string }) => {
  return (
    <div className="flex flex-col justify-center items-center text-center p-4 m-1 rounded-full w-full h-24 text-xl md:text-2xl lg:text-3xl transition duration-150 hover:text-[#ea4c4c] hover:bg-slate-200">
      <p>{props.rule}</p>
    </div>
  );
};

const Rules = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ duration: 1 }}
      className="flex flex-col justify-center items-center w-11/12 sm:w-5/6 md:w-1/2"
    >
      <h1 className="text-3xl md:text-5xl lg:text-7xl text-[#ea4c4c]">
        Trading Rules
      </h1>
      <h2 className="font-serif text-base md:text-xl lg:text-2xl transition duration-150 hover:text-[#ea4c4c] mt-4">
        “Risk comes from not knowing what you&rsquo;re doing.”{" "}
      </h2>
      <h2 className="font-serif mb-4"> - Warren Buffett</h2>
      <div className="flex flex-col" id="rules-grid">
        {rules.map((rule: string) => {
          return <Rule rule={rule} key={rule} />;
        })}
      </div>
    </motion.div>
  );
};

export default Rules;
