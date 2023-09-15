import { DefaultSeo } from "next-seo";
import "../styles/global.scss";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <DefaultSeo
        title="InkedEnigma"
        description=""
        openGraph={{
          type: "website",
          locale: "en_IE",
          url: "",
          siteName: "InkedEnigma",
        }}
        additionalLinkTags={[
          {
            rel: "icon",
            href: "/favicon.ico",
          },
        ]}
        keywords="draw, multiplayer, scribble"
      />
      <Component {...pageProps} />
    </>
  );
}
