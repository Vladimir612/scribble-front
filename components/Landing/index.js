import React from "react";
import MainNav from "./../utils/MainNav/MainNav";
import Hero from "./Hero/Hero";
import ValuesContainer from "./ValuesContainer/ValuesContainer";
import Footer from "../utils/Footer/Footer";

const Landing = () => {
  return (
    <>
      <MainNav />
      <Hero />
      <ValuesContainer />
      <Footer />
    </>
  );
};

export default Landing;
