export type NewsSource = {
  name: string;
  url: string;
  paths: string[];
  selector: string; // listing item or anchor selector
  linkSelector?: string; // when selector is not an <a>
  coverSelector?: string; // optional: cover container inside anchor (e.g., 'div.cover')
  contentSelector?: string; // optional: content container inside anchor (e.g., 'div.content')
};

// You can extend this list freely. The API route imports it.
export const newsSources: NewsSource[] = [
  {
    name: "CoinDesk",
    url: "https://www.coindesk.com",
    paths: [
      "/latest-crypto-news",
      "/markets/",
      "/tech/",
      "/business/",
      "/policy/",
    ],
    // Livewire module article items
    selector:
      'div[data-module-name="livewire-module"] .bg-white.flex.gap-6.w-full.shrink.justify-between',
    linkSelector: "a.text-color-charcoal-900.content-card-title",
  },
  {
    name: "CryptoSlate",
    url: "https://cryptoslate.com",
    paths: ["/top-news/"],
    // Select each post's anchor directly: div.posts > div.list-post > article > a
    selector: "div.posts > div.list-post > article > a",
    coverSelector: "div.cover",
    contentSelector: "div.content",
  },
  {
    name: "NewsBTC",
    url: "https://www.newsbtc.com",
    paths: ["/news/"],
    selector: "article.jeg_post :header > a",
  },
  // Uncomment or add more as needed. Provide a 'selector' for the item and a 'linkSelector' for the anchor inside if needed.
  // {
  //   name: "Cointelegraph",
  //   url: "https://cointelegraph.com",
  //   paths: ["/tags/bitcoin", "/tags/ethereum"],
  //   selector: "article",
  //   linkSelector: "a[href]",
  // },
  // {
  //   name: "Decrypt",
  //   url: "https://decrypt.co",
  //   paths: ["/news"],
  //   selector: "article",
  //   linkSelector: "a[href]",
  // },
];
