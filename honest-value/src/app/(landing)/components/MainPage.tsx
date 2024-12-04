import React from "react";
import Hero from "./Hero";
import Impact from "./Impact";
import Process from "./Process";
import TestimonialSlider from "./Reviews";
import Faq from "./Faq";
import GetStarted from "./GetStarted";

const MainPage: React.FC = () => {
  return (
    <div>
      <Hero />
      <Impact />
      <Process />
      <TestimonialSlider />
      <Faq />
      <GetStarted />
    </div>
  );
};

export default MainPage;
