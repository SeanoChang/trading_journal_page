"use client";
import NavBar from "../../../components/home/protected/Navbar";
import Header from "../../../components/home/protected/Header";
import TradingPairs from "../../../components/home/protected/TradingPairs";
import LearningResources from "../../../components/home/protected/LearningResources";
import Rules from "../../../components/home/protected/Rules";
import Footer from "../../../components/general/Footer";

export default function IdeasHomeClient({ tradingPairs }: { tradingPairs: string[] }) {
  return (
    <div className="w-full text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-[#161624] shadow-slate-900/50 dark:shadow-slate-300/50">
      <NavBar />
      <main className="flex flex-col justify-center items-center min-h-screen">
        <Header />
        <Rules />
        <TradingPairs tradingPairs={tradingPairs} />
        <LearningResources />
      </main>
      <Footer />
    </div>
  );
}

