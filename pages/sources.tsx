import React from "react";
import Link from "next/link";
import Head from "next/head";

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
      <Head>
        <title>Seano&rsquo;s Trading Ideas</title>
        <meta name="description" content="Trading ideas for crypto." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="google-site-verification"
          content="Q2eq-3vOWJK4BGDPiQWbFgFna4xbWmXlKZnGuPTBCbo"
        />
      </Head>
      <main>
        <div className="sticky w-full">
          <Link href="/">Back</Link>
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
      </main>
    </div>
  );
};

export default SourcesPage;
