import { NextSeo } from "next-seo";
import Landing from "./../components/Landing/index";

export default function Home() {
  return (
    <>
      <NextSeo title="InkedEnigma | Home" />
      <Landing />
    </>
  );
}
