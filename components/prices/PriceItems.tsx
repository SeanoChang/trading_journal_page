import type { Price } from "../../types/market";
import { PriceTag } from "./PriceTag";

interface PriceItemsProps {
  prices: Price[];
}

export function PriceItems({ prices }: PriceItemsProps) {
  const pricesComponents = prices.map((price: Price, i: number) => (
    <PriceTag price={price} length={prices.length} key={i} />
  ));

  return <>{pricesComponents}</>;
}
