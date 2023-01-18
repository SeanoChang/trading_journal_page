import { motion } from "framer-motion";

const rules: string[] = [
  "Do not trade with emotions",
  "Set stop loss everytime",
  "Know where to exit before you enter",
  "Don't chase trades",
];

const Rule = (props: { rule: string }): JSX.Element => {
  return (
    <div className="flex flex-col justify-center items-center text-center p-4 m-1 rounded-md w-72 h-36 lg:w-96 lg:h-48 text-xl md:text-2xl lg:text-3xl transition duration-150 hover:text-slate-700 hover:bg-slate-200">
      <p>{props.rule}</p>
    </div>
  );
};

const Rules = (): JSX.Element => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ duration: 1 }}
      className="flex flex-col justify-center items-center"
    >
      <h1 className="text-3xl md:text-5xl lg:text-7xl text-[#ea4c4c]">Rules</h1>
      <h2 className="text-base md:text-xl lg:text-2xl transition duration-150 hover:text-[#ea4c4c] mt-4">
        “Risk comes from not knowing what you're doing.”{" "}
      </h2>
      <h2 className="mb-4"> - Warren Buffett</h2>
      <div className="grid sm:grid-cols-2" id="rules-grid">
        {rules.map((rule: string) => {
          return <Rule rule={rule} key={rule} />;
        })}
      </div>
    </motion.div>
  );
};

export default Rules;
