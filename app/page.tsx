import HomeClient from "./HomeClient";

export default function Home() {
  const randQuote = Math.floor(Math.random() * 1000);
  return <HomeClient randQuote={randQuote} />;
}
