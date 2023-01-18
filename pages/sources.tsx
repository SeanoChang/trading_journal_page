import React from "react";
import Link from "next/link";

const ListItems = (props: { link: string; text: string }): JSX.Element => {
  return (
    <li className="hover:underline text-lg md:text-xl">
      <Link href={props.link}>{props.text}</Link>
    </li>
  );
};

const SourcesPage = (): JSX.Element => {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center">
      <div className="sticky w-full">
        <a href="/">Back</a>
      </div>
      <h1>Sources Page</h1>
      <div>
        <h1>News</h1>
      </div>
      <div>
        <h1>Icons</h1>
        <ul>
          <ListItems link="https://cryptologos.cc/" text="Crypto Logos" />
          <ListItems
            link="https://github.com/spothq/cryptocurrency-icons"
            text="cryptoicons.co"
          />
          <ListItems
            link="https://seeklogo.com/free-vector-logos/solana"
            text="seeklogo for Solana, Lunc"
          />
          <ListItems
            link="https://near.org/about/brand/"
            text="NEAR for Near icon"
          />
          <ListItems
            link="https://www.iconfinder.com/"
            text="Icon Finder for Cardano"
          />
          <ListItems
            link="https://iconduck.com/icons/81765/generic-cryptocurrency"
            text="Icon Duck for Generic Cryptocurrency"
          />
          <ListItems
            link="https://www.marketbeat.com/cryptocurrencies/aptos/"
            text="Market Beat for Aptos"
          />
          <ListItems
            link="https://mobile.twitter.com/dydx"
            text="Dydx for Dydx"
          />
          <ListItems
            link="https://pixelbuddha.net/icons/blockchain-vector-icons-free-download"
            text="Blockchain icons"
          />
        </ul>
      </div>
    </div>
  );
};

export default SourcesPage;
