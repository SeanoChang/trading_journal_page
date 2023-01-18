import React, { useState, useEffect, use } from "react";
import { motion } from "framer-motion";

type Quote = {
  quote: string;
  author: string;
};

const Quote = (props: { rand: number }): JSX.Element => {
  const [quote, setQuote] = useState<Quote>(quotes[props.rand]);
  const [rand, setRand] = useState<number>(props.rand);

  const handleChangeQuote = () => {
    const newRand = Math.floor(Math.random() * quotes.length);
    if (newRand !== rand) {
      setQuote(quotes[newRand]);
      setRand(newRand);
    } else {
      handleChangeQuote();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="flex flex-col justify-center items-center w-full mt-8 px-2 hover:cursor-pointer max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl"
      onClick={() => {
        handleChangeQuote();
      }}
    >
      <span className="text-sm md:text-lg xl:text-xl italic text-center hover:underline">
        &ldquo;{quote.quote}&ldquo;
      </span>
      <span className="text-xs md:text-sm xl:text-base"> - {quote.author}</span>
    </motion.div>
  );
};

export default Quote;

const quotes: Quote[] = [
  {
    quote:
      "The goal of a successful trader is to make the best trades. Money is secondary.",
    author: "Alexander Elder",
  },
  {
    quote: "Do more of what works and less of what doesn't.",
    author: "Steve Clark",
  },
  {
    quote: "Never, ever argue with your trading system",
    author: "Michael Covel",
  },
  {
    quote:
      "In this business, if you're good, you're right six times out of ten. You're never going to be right nine times out of ten.",
    author: "Peter Lynch",
  },
  {
    quote:
      "All the math you need in the stock market you get in the fourth grade.",
    author: "Peter Lynch",
  },
  {
    quote:
      "Novice Traders trade 5 to 10 times too big. They are taking 5 to 10 percent risk, on a trade they should be taking 1 to 2 percent risk on.",
    author: "Bruce Kovner",
  },
  {
    quote: "In investing, what is comfortable is rarely profitable.",
    author: "Robert Arnott",
  },
  {
    quote:
      "There is no single market secret to discover, no single correct way to trade the markets. Those seeking the one true answer to the markets haven't even gotten as far as asking the right question, let alone getting the right answer.",
    author: "Jack Schwagger",
  },
  {
    quote:
      "If most traders would learn to sit on their hands 50 percent of the time, they would make a lot more money.",
    author: "Bill Lipschutz",
  },
  {
    quote:
      "In trading/investing, it's not about how much you make but rather how much you don't lose.",
    author: "Bernard Baruch",
  },
  {
    quote:
      "Every trader has strengths and weaknesses. Some are good holders of winners but may hold their losers a little too long. Others may cut their winners a little short but are quick to take their losses. As long as you stick to your own style, you get the good and bad in your own approach.",
    author: "Michael Marcus",
  },
  {
    quote: "Time is your friend; impulse is your enemy.",
    author: "John Bogle",
  },
  {
    quote:
      "There is a time to go long, a time to go short and a time to go fishing.",
    author: "Jesse Livermore",
  },
  {
    quote: "Do not anticipate and move without market confirmatio",
    author:
      "being a little late in your trade is your insurance that you are right or wrong.”",
  },
  {
    quote:
      "The desire for constant action irrespective of underlying conditions is responsible for many losses in Wall Street even among the professionals, who feel that they must take home some money every day, as though they were working for regular wages.",
    author: "Jesse Livermore",
  },
  {
    quote: "Money is made by sitting, not trading.",
    author: "Jesse Livermore",
  },
  {
    quote:
      "I learned early that there is nothing new in Wall Street. There can't be because speculation is as old as the hills. Whatever happens in the stock market today has happened before and will happen again. I've never forgotten that.",
    author: "Jesse Livermore",
  },
  {
    quote:
      "Why do you think unsuccessful traders are obsessed with market analysis? They crave the sense of certainty that analysis appears to give them. Although few would admit it, the truth is that the typical trader wants to be right on every single trade. He is desperately trying to create certainty where it just doesn't exist.",
    author: "Mark Douglas",
  },
  {
    quote:
      "If you can learn to create a state of mind that is not affected by the market's behaviour, the struggle will cease to exist.",
    author: "Mark Douglas",
  },
  {
    quote:
      "Dangers of watching every tick are twofold: overtrading and increased chances of prematurely liquidating good positions.",
    author: "Jack Schwagger",
  },
  {
    quote:
      "We want to perceive ourselves as winners, but successful traders are always focusing on their losses.",
    author: "Peter Borish",
  },
  {
    quote:
      "Throughout my financial career, I have continually witnessed examples of other people that I have known being ruined by a failure to respect risk. If you don't take a hard look at risk, it will take you.",
    author: "Larry Hite",
  },
  {
    quote: "Frankly, I don't see markets; I see risks, rewards, and money.",
    author: "Larry Hite",
  },
  {
    quote:
      "I don't think you can get to be a really good investor over a broad range without doing a massive amount of reading. I don't think anyone book will do it for you.",
    author: "Charlie Munge",
  },
  {
    quote:
      "In the short run, the market is a voting machine, but in the long run it is a weighing machine.",
    author: "Benjamin Graham",
  },
  {
    quote:
      "It's not what we do once in a while that shapes our lives. It's what we do consistently.",
    author: "Tony Robbin",
  },
  {
    quote: "Bulls make money, bears make money, pigs get slaughtered.",
    author: "Unknown",
  },
  {
    quote:
      "Investing should be more like watching paint dry or watching grass grow. If you want excitement, take $800 and go to Las Vegas.",
    author: "Paul Samuelson",
  },
  {
    quote: "The fundamental law of investing is the uncertainty of the future.",
    author: "Peter Bernstein",
  },
  {
    quote:
      "You can be free. You can live and work anywhere in the world. You can be independent from routine and not answer to anybody.",
    author: "Alexander Elde",
  },
  {
    quote:
      "You have to identify your weaknesses and work to change. Keep a trading diary – write down your reasons for entering and exiting every trade. Look for repetitive patterns of success and failure.",
    author: "Alexander Elder",
  },
  {
    quote:
      "Sheer will and determination is no substitute for something that actually works.",
    author: "Jason Klatt",
  },
  {
    quote:
      "Short-term volatility is greatest at turning points and diminishes as a trend becomes established.",
    author: "George Soros",
  },
  {
    quote:
      "Markets are constantly in a state of uncertainty and flux, and money is made by discounting the obvious and betting on the unexpected.",
    author: "George Soros",
  },
  {
    quote:
      "It's not whether you're right or wrong that's important, it's how much money you make when you're right and how much you lose when you're wrong.",
    author: "George Soros",
  },
  {
    quote: "In trading, the impossible happens about twice a year.",
    author: "Henri M Simoes",
  },
  {
    quote:
      "The core problem, however, is the need to fit markets into a style of trading rather than finding ways to trade that fit with market behaviour.",
    author: "Brett Steenbarger",
  },
  {
    quote: "Never invest in any idea you can't illustrate with a crayon.",
    author: "Peter Lynch",
  },
  {
    quote:
      "I get real, real concerned when I see trading strategies with too many rules (you should too).",
    author: "Larry Connors",
  },
  {
    quote:
      "I just wait until there is money lying in the corner, and all I have to do is go over there and pick it up. I do nothing in the meantime.",
    author: "Jim Rogers",
  },
  {
    quote: "I believe in analysis and not forecasting.",
    author: "Nicolas Darvas",
  },
  {
    quote:
      "Trading doesn't just reveal your character, it also builds it if you stay in the game long enough.",
    author: "Yvan Byeajee",
  },
  {
    quote: "Focus, patience, wise discernment, non-attachmen",
    author:
      "the skills you acquire in meditation and the skills you need to thrive in trading are one and the same.”",
  },
  {
    quote:
      "Confidence is not 'I will profit on this trade.' Confidence is 'I will be fine if I don't profit from this trade.",
    author: "Yvan Byeajee",
  },
  {
    quote:
      "You will never find fulfilment trading the markets if you don't learn to appreciate and be satisfied with what you already have.",
    author: "Yvan Byeajee",
  },
  {
    quote: "Beware of trading quotes.",
    author: "Andreas Clenow",
  },
  {
    quote:
      "Learn to take losses. The most important thing in making money is not letting your losses get out of hand.",
    author: "Martin Schwartz",
  },
  {
    quote:
      "A lot of people get so enmeshed in the markets that they lose their perspective. Working longer does not necessarily equate with working smarter. In fact, sometimes is the other way around.",
    author: "Martin Schwartz",
  },
  {
    quote:
      "When I became a winner, I said, 'I figured it out, but if I'm wrong, I'm getting the hell out, because I want to save my money and go on to the next trade.",
    author: "Martin Schwartz",
  },
  {
    quote:
      "I have learned through the years that after a good run of profits in the markets, it's very important to take a few days off as a reward. The natural tendency is to keep pushing until the streak ends. But experience has taught me that a rest in the middle of the streak can often extend it.",
    author: "Martin Schwartz",
  },
  {
    quote:
      "I always laugh at people who say, 'I've never met a rich technician.' I love that! It's such an arrogant, nonsensical response. I used fundamentals for nine years and got rich as a technician.",
    author: "Martin Schwartz",
  },
  {
    quote:
      "When I get hurt in the market, I get the hell out. It doesn't matter at all where the market is trading. I just get out, because I believe that once you're hurt in the market, your decisions are going to be far less objective than they are when you're doing well… If you stick around when the market is severely against you, sooner or later they are going to carry you out.",
    author: "Randy McKay",
  },
  {
    quote:
      "I'll keep reducing my trading size as long as I'm losing… My money management techniques are extremely conservative. I never risk anything approaching the total amount of money in my account, let alone my total funds.",
    author: "Randy McKay",
  },
  {
    quote:
      "The stock market is filled with individuals who know the price of everything, but the value of nothing.",
    author: "Phillip Fisher",
  },
  {
    quote:
      "How many millionaires do you know who have become wealthy by investing in savings accounts? I rest my case.",
    author: "Robert G. Allen",
  },
  {
    quote:
      "Losses are necessary, as long as they are associated with a technique to help you learn from them",
    author: "David Sikhosana",
  },
  {
    quote: "Every day I assume every position I have is wrong.",
    author: "Paul Tudor Jones",
  },
  {
    quote:
      "The secret to being successful from a trading perspective is to have an indefatigable and an undying and unquenchable thirst for information and knowledge.",
    author: "Paul Tudor Jones",
  },
  {
    quote:
      "Trading is very competitive and you have to be able to handle getting your butt kicked.",
    author: "Paul Tudor Jones",
  },
  {
    quote:
      "That cotton trade was almost the deal breaker for me. It was at that point that I said, 'Mr. Stupid, why risk everything on one trade? Why not make your life a pursuit of happiness rather than pain?",
    author: "Paul Tudor Jones",
  },
  {
    quote:
      "I'm always thinking about losing money as opposed to making money. Don't focus on making money, focus on protecting what you have",
    author: "Paul Tudor Jones",
  },
  {
    quote: "An investment in knowledge pays the best interest.",
    author: "Benjamin Franklin",
  },
  {
    quote:
      "Do not be embarrassed by your failures, learn from them and start again.",
    author: "Richard Branson",
  },
  {
    quote:
      "He who knows when he can fight and when he cannot, will be victorious.",
    author: "Sun Tzu",
  },
  {
    quote:
      "Win or lose, everybody gets what they want out of the market. Some people seem to like to lose, so they win by losing money.",
    author: "Ed Seykota",
  },
  {
    quote:
      "The elements of good trading are (1) cutting losses, (2) cutting losses, and (3) cutting losses. If you can follow these three rules, you may have a chance.",
    author: "Ed Seykota",
  },
  {
    quote: "The trend is your friend until the end when it bends.",
    author: "Ed Seykota",
  },
  {
    quote:
      "Are you willing to lose money on a trade? If not, then don't take it. You can only win if you're not afraid to lose. And you can only do that if you truly accept the risks in front of you.",
    author: "Sami Abusaad",
  },
  {
    quote: "If you personalise losses, you can't trade.",
    author: "Bruce Kovner",
  },
  {
    quote: "I know where I'm getting out before I get in.",
    author: "Bruce Kovner",
  },
  {
    quote:
      "I think investment psychology is by far the more important element, followed by risk control, with the least important consideration being the question of where you buy and sell.",
    author: "Tom Basso",
  },
  {
    quote:
      "Stocks are bought not in fear but in hope. They are typically sold out of fear.",
    author: "Justin Mamis",
  },
  {
    quote:
      "What seems too high and risky to the majority generally goes higher and what seems low and cheap generally goes lower.",
    author: "William O'Neil",
  },
  {
    quote:
      "Letting losses run is the most serious mistake made by most investors.",
    author: "William O'Neil",
  },
  {
    quote:
      "The market is a device for transferring money from the impatient to the patient.",
    author: "Warren Buffet",
  },
  {
    quote:
      "You don't need to be a rocket scientist. Investing is not a game where the guy with the 160 IQ beats the guy with 130 IQ.",
    author: "Warren Buffet",
  },
  {
    quote:
      "We simply attempt to be fearful when others are greedy and to be greedy only when others are fearful.",
    author: "Warren Buffet",
  },
  {
    quote:
      "It takes 20 years to build a reputation and five minutes to ruin it. If you think about that, you'll do things differently.",
    author: "Warren Buffet",
  },
  {
    quote: "Look at market fluctuations as your friend rather than your enemy.",
    author: "Warren Buffet",
  },
  {
    quote: "Profit from folly, rather than participate in it.",
    author: "Warren Buffet",
  },
  {
    quote: "Markets can remain irrational longer than you can remain solvent.",
    author: "John Maynard Keynes",
  },
  {
    quote:
      "Accepting losses is the most important single investment device to ensure the safety of capital.",
    author: "Gerald M. Loeb",
  },
  {
    quote: "The hard part is discipline, patience and judgement.",
    author: "Seth Klarman",
  },
  {
    quote:
      "In reality, no one knows what the market will do; trying to predict it is a waste of time, and investing based upon that prediction is a speculative undertaking.",
    author: "Seth Klarman",
  },
  {
    quote: "I always define my risk, and I don't have to worry about it.",
    author: "Tony Saliba",
  },
  {
    quote: "Hope is [a] bogus emotion that only costs you money.",
    author: "Jim Cramer",
  },
  {
    quote:
      "The key to trading success is emotional discipline. If intelligence were the key, there would be a lot more people making money trading… I know this will sound like a cliche, but the single most important reason that people lose money in the financial markets is that they don't cut their losses short.",
    author: "Victor Sperandeo",
  },
  {
    quote: "All you need is one pattern to make a living.",
    author: "Linda Raschke",
  },
  {
    quote: "Sometimes the best trade is no trade.",
    author: "Unknown",
  },
  {
    quote:
      "Patterns don't work 100% of the time. But they are still critical because they help you define your risk. If you ignore patterns and focus on hunches, feelings, and hot tips, just forget about achieving consistency.",
    author: "Ifan Wei",
  },
  {
    quote: "It's ok to be wrong; it's unforgivable to stay wrong.",
    author: "Martin Zweig",
  },
  {
    quote:
      "The four most dangerous words in investing are: This time it's different.",
    author: "Sir John Templeton",
  },
  {
    quote: "There is a huge difference between a good trade and good trading.",
    author: "Steve Burns",
  },
  {
    quote:
      "Buy things that are going up. Sell things that are going down. And when they stop, get out!",
    author: "Rob Smith",
  },
  {
    quote:
      "Don't blindly follow someone, follow [the] market and try to hear what it is telling you.",
    author: "Jaymin Shah",
  },
  {
    quote:
      "You never know what kind of setup [the] market will present to you, your objective should be to find [an] opportunity where risk-reward ratio is best.",
    author: "Jaymin Shah",
  },
  {
    quote:
      "What's the difference between a pro and an amateur? Professionals look for what's wrong with a setup. Amateurs only look for what's right.",
    author: "Mark Harila",
  },
  {
    quote:
      "A peak performance trader is totally committed to being the best and doing whatever it takes to be the best. He feels totally responsible for whatever happens and thus can learn from mistakes. These people typically have a working business plan for trading because they treat trading as a business.",
    author: "Van K. Tharp",
  },
  {
    quote:
      "As much as possible you don't want to be well paid merely for taking big risks. Anyone can manage that. You want to be well-paid because you did your homework.",
    author: "Joel Greenblatt",
  },
  {
    quote:
      "Traders need a daily routine that they love. If you don't love it, you're not gonna do it.",
    author: "Scott Redler",
  },
  {
    quote: "Trade the market in front of you, not the one you want!",
    author: "Scott Redler",
  },
];
