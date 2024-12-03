"use client";

import { useState } from "react";
import Image from "next/image";
import { processSteps } from "@/__data__/ourProcess";
import { MoveRight } from "lucide-react";
import NormalFadeUp from "../animation/NormalFadeUp";
import RightSlide from "../animation/RightSlide";

export default function ProcessGallery() {
  const [activeTab, setActiveTab] = useState(1);
  const [activeStep, setActiveStep] = useState(1);

  console.log("step:", activeStep);

  return (
    <div className="w-full py-12 px-4 ">
      <NormalFadeUp>
        <h1 className="text-4xl font-bold text-center mb-8">
          How Our Process Works
        </h1>
      </NormalFadeUp>

      {/* TABS */}
      <div className="flex justify-center mb-12">
        <ul className="flex text-nowrap overflow-auto  items-center bg-primary/10 rounded-full px-3 py-2 relative">
          <div
            className={`${
              (activeTab === 1 && "translate-x-[0px]  w-40") ||
              (activeTab === 2 && "translate-x-[160px]") ||
              (activeTab === 3 && "translate-x-[322px] w-[120px]") ||
              (activeTab === 4 && "!w-[150px] translate-x-[450px]") ||
              (activeTab === 5 && "!w-[130px] translate-x-[608px]")
            } !bg-primary absolute !text-[#fff] h-[85%] w-40 transition duration-700 rounded-full border-transparent cursor-pointer`}
          ></div>
          {[
            "Property Search",
            "Data Gathering",
            "Ai Analysis",
            "Appeal Process",
            "Tax Savings",
          ].map((tab, index) => (
            <li
              key={index}
              className={`tab tab-${
                index + 1
              } px-6 py-2 z-20 transition duration-300 font-medium rounded-full border-transparent cursor-pointer ${
                activeTab === index + 1 ? "!text-[#fff]" : "text-black"
              }`}
              onClick={() => setActiveTab(index + 1)}
            >
              {tab}
            </li>
          ))}
        </ul>
      </div>

      {/* Process Steps */}
      <div className="flex flex-col items-center">
        <div className="flex flex-col md:flex-row gap-4 w-full px-4 xl:container overflow-hidden">
          {processSteps.map((step) => (
            <RightSlide
              delay={0.3 * step.id}
              key={step.id}
              className={`relative rounded-3xl overflow-hidden  transition-all duration-500 ${
                activeStep === step.id
                  ? "w-full md:w-[60%] h-[500px]"
                  : "h-[100px] md:h-[500px] md:w-[10%]"
              }`}
            >
              <div key={step.id} onClick={() => setActiveStep(step.id)}>
                <Image
                  src={step.image}
                  alt={step.title}
                  width={800}
                  height={600}
                  className="object-cover w-full h-[500px]"
                />
                <div
                  className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white transition-opacity duration-300 ${
                    activeStep === step.id ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <NormalFadeUp>
                    <div className="mb-2 text-xs bg-gray-600 w-fit p-1 rounded-full px-3 bg-opacity-50 font-medium">
                      STEP {step.id}
                    </div>
                  </NormalFadeUp>
                  <NormalFadeUp delay={0.3}>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  </NormalFadeUp>
                  <NormalFadeUp delay={0.6}>
                    <div className=" flex gap-6 items-center">
                      <p className="text-xs opacity-90">{step.description}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (step.id < 5) {
                            setActiveStep(step.id + 1);
                          }
                          //   alert("sdsdsd");
                        }}
                        className=" flex-shrink-0  relative z-20 cursor-pointer  bg-white rounded-full w-10 h-10 flex items-center justify-center"
                      >
                        <MoveRight className="text-black" size={16} />
                      </button>
                    </div>
                  </NormalFadeUp>
                </div>

                {/* FOR THE DESELECTED PICTURE */}
                <div
                  className={`absolute inset-0  bg-black/60 flex  items-end pl-4 text-white  ${
                    activeStep === step.id ? "opacity-0" : "opacity-100"
                  }`}
                >
                  <div className="  absolute bottom-2 md:bottom-6 left-2 md:left-4">
                    <NormalFadeUp>
                      <div className="mb-1 md:mb-2 text-[10px] md:text-xs bg-gray-600 w-fit p-1 rounded-full px-2 md:px-3 bg-opacity-50 font-medium">
                        STEP {step.id}
                      </div>
                    </NormalFadeUp>
                    <NormalFadeUp delay={0.3}>
                      <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-2 line-clamp-1">
                        {step.title}
                      </h3>
                    </NormalFadeUp>
                    <NormalFadeUp delay={0.6}>
                      <p className="text-[10px] md:text-xs opacity-90 line-clamp-1 md:line-clamp-2">
                        {step.description}
                      </p>{" "}
                    </NormalFadeUp>
                  </div>
                  {/* <span className="text-white font-medium transform -rotate-90">
                  STEP {step.id}
                </span> */}
                </div>
              </div>
            </RightSlide>
          ))}
        </div>
      </div>
    </div>
  );
}
