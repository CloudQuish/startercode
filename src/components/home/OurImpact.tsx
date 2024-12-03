import { featureCards, ourImpacts } from "@/__data__/ourImpact";
import Image from "next/image";
import React from "react";
import NormalFadeUp from "../animation/NormalFadeUp";
import RightSlide from "../animation/RightSlide";

export default function OurImpact() {
  return (
    <div className=" mt-10 bg-primary/10 rounded-3xl py-4">
      <section className="xl:container px-4 py-4 text-center  ">
        {/* SHORT DESC */}
        <div className=" max-w-3xl mx-auto space-y-4">
          <NormalFadeUp>
            <h6 className="capitalize font-semibold  text-primary mb-6">
              Our Impact
            </h6>
          </NormalFadeUp>
          <NormalFadeUp delay={0.2}>
            <h2 className=" text-3xl md:text-4xl">
              Why Reach Out To JumboTax?
            </h2>
          </NormalFadeUp>
          <NormalFadeUp delay={0.4}>
            <p className="text-xs tracking-wide">
              Reaching out to JumboTax ensures you pay property taxes that truly
              reflect your property's value. With our AI-driven expertise, we
              navigate the intricate landscape of property tax appeals. Simply
              share your property details, and our intelligent system ensures
              you're not overpaying a dime. Partner with JumboTax for fair
              property tax
            </p>
          </NormalFadeUp>
        </div>
        {/* STATS */}
        <div className=" flex flex-wrap md:flex-nowrap items-center justify-center mt-4 gap-4 ">
          {ourImpacts.map((impact, idx) => (
            <RightSlide key={idx} delay={0.3 * (idx + 1)}>
              <div className=" bg-white flex items-center justify-center flex-col gap-2 md:gap-4  rounded-2xl h-40 md:h-[220px] w-[280px]">
                <h2 className=" text-3xl sm:text-4xl md:text-6xl font-bold text-primary">
                  {impact.stats}
                </h2>
                <p className="text-primary sm:text-base text-sm font-medium ">
                  {impact.title}
                </p>
              </div>
            </RightSlide>
          ))}
        </div>
        {/* FEATURE CARDS */}

        <div className=" flex sm:flex-nowrap flex-wrap items-center justify-center gap-4 mt-6">
          {featureCards.map((feature, idx) => {
            return (
              <NormalFadeUp key={idx} delay={0.3 * (idx + 1)}>
                <div className=" rounded-3xl">
                  <Image
                    src={feature.img}
                    alt={feature.title}
                    height={400}
                    width={400}
                    className=" w-full rounded-t-3xl"
                  />
                  <div className=" bg-primary/15 rounded-b-3xl px-4 py-3 pb-4">
                    <h2 className=" text-[20px]">{feature.title}</h2>
                    <p className=" text-muted-foreground text-xs mt-3">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </NormalFadeUp>
            );
          })}
        </div>
      </section>
    </div>
  );
}
