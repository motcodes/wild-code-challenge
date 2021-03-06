import NextHead from "next/head";
import { AppProps } from "next/app";
import { DefaultSeo, DefaultSeoProps } from "next-seo";
import { GlobalStyles } from "~/styles/GlobalStyles";
import { MouseContextProvider } from "~/contexts/mouseContext";
import { Cursor } from "~/components/customCursor";

const defaultSeo: DefaultSeoProps = {
  title: "Wild Code Challenge by @motcodes",
  titleTemplate: "%s | wild",
  description: "This is the 2021 Wild Code Challenge by @motcodes.",
  twitter: {
    cardType: "summary_large_image",
  },
  openGraph: {
    type: "website",
    images: [{ url: "/social-embed.png" }],
  },
};

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <DefaultSeo {...defaultSeo} />
      <NextHead>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000" />
        <link rel="manifest" href="/site.webmanifest" crossOrigin="use-credentials" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="preload" href="/fonts/Tungsten-Bold.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/Tungsten-Semibold.woff2" as="font" type="font/woff2" crossOrigin="" />
      </NextHead>
      <GlobalStyles />
      <MouseContextProvider>
        <Cursor />
        <Component {...pageProps} />
      </MouseContextProvider>
    </>
  );
};

export default App;
