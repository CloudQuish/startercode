import React from "react";
import { Button } from "../ui/button";
import {
  ArrowDownLeft,
  ArrowDownRight,
  ArrowUpRight,
  MoveUpRight,
} from "lucide-react";
import { FiArrowUpRight } from "react-icons/fi";
import NormalFadeUp from "../animation/NormalFadeUp";
import RightSlide from "../animation/RightSlide";

export default function Hero() {
  return (
    <div className=" min-h-screen xl:container px-2 md:px-4">
      <div
        style={{
          background: "url(/home/bgclip2.png) center/cover",
        }}
        className="flex items-center justify-start px-4 md:px-16  h-screen object-cover w-full rounded-3xl relative"
      >
        {/* <div className=" absolute inset-0 bg-gradient-to-r rounded-3xl from-black/70 via-transparent to-transparent"></div> */}

        {/* HERO SECTION DESCRIPTIONS */}
        <div className=" text-white space-y-4 max-w-xl  relative z-10">
          <NormalFadeUp>
            <h2 className=" text-4xl md:text-6xl">
              One Step Away <br /> From Honest Value
            </h2>
          </NormalFadeUp>
          <NormalFadeUp delay={0.2}>
            <p className="text-xs">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Maiores
              cum atque pariatur itaque maxime eum earum et, minus assumenda
              sunt voluptates
            </p>
          </NormalFadeUp>
          <NormalFadeUp delay={0.6}>
            <Button className=" hover:bg-primary hover:text-white bg-white gap-2 flex items-center rounded-full text-primary">
              Get Started <FiArrowUpRight size={10} />
            </Button>
          </NormalFadeUp>
        </div>

        {/* STATS */}
        <div className="absolute bottom-2 md:bottom-20 right-[30%] translate-x-[64%] md:translate-x-[67%] lg:translate-x-[50%] xl:translate-x-[38%] z-10 text-black  ">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex md:flex-row flex-col md:gap-10 lg:gap-20 gap-4">
              {/* 80%  */}
              <RightSlide delay={0.4}>
                <div className="space-y-2 md:space-y-4">
                  <div className="flex items-center gap-2 ">
                    <span className="text-xl md:text-4xl font-semibold">
                      80%
                    </span>
                    <span className="flex items-center text-sm text-emerald-400">
                      <span className=" p-1 mr-1 bg-emerald-100 rounded-full">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                      54%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Use of Recycled
                    <br />
                    Materials
                  </p>
                </div>
              </RightSlide>

              {/* 65% */}
              <RightSlide delay={0.6}>
                <div className="space-y-2 md:space-y-4">
                  <div className="flex items-center gap-2">
                    <span className=" text-xl md:text-4xl font-semibold">
                      65%
                    </span>
                    <span className="flex items-center text-sm text-red-600">
                      <span className=" p-1 mr-1 bg-red-100 rounded-full">
                        <ArrowDownLeft className="h-4 w-4" />
                      </span>
                      35%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Carbon Emission
                    <br />
                    Reduction
                  </p>
                </div>
              </RightSlide>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
