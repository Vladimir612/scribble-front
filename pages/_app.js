import { DefaultSeo } from "next-seo";
import "../styles/global.scss";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <DefaultSeo
        title="HireClass"
        description="We help you to become part of IT industry by providing free IT courses
          made for your dream job."
        openGraph={{
          type: "website",
          locale: "en_IE",
          url: "https://www.hireclass.rs/",
          siteName: "HireClass",
        }}
        additionalLinkTags={[
          {
            rel: "icon",
            href: "/favicon.ico",
          },
        ]}
        keywords="courses, tutorials, IT, web, frontend, job, company"
      />
      <Component {...pageProps} />
    </>
  );
}
