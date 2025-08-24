import "../styles/globals.css";
import type { ReactNode } from "react";
import Providers from "./providers";
import AppChrome from "../components/general/AppChrome";

export const metadata = {
  title: "Seano’s Trading Page",
  description: "Website for crypto news and prices",
  other: {
    "google-site-verification": "Q2eq-3vOWJK4BGDPiQWbFgFna4xbWmXlKZnGuPTBCbo",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppChrome>{children}</AppChrome>
        </Providers>
      </body>
    </html>
  );
}
