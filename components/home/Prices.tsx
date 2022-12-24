import React, { useState, useEffect } from "react";

type Prices = {
  name: string;
  symbol: string;
  price: number;
  percent_change_1h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  market_cap: number;
  volume_24h: number;
  time_stamp: string;
};

const Prices = (props: { assets: Prices[] }): JSX.Element => {
  const [prices, setPrices] = useState([...props.assets]);

  const pricesComponents = prices.map((price: Prices) => {
    return (
      <div key={price.symbol} className="p-4">
        {price.symbol} - {price.price}
      </div>
    );
  });

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-3xl sm:text-4xl lg:text-6xl">Prices</h1>
      <div className="flex flex-row justify-around">{pricesComponents}</div>
    </div>
  );
};

export default Prices;
