"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SubItemTabs from "./SubItem";
import staticDataRaw from "../../../statics/staticData.json";
import { StaticData } from "@/interfaces/static-data.interface";
import AnimatedWrapper from "../../../reusables/AnimatedWrapper";
import { truncateByLetters, truncateByWords } from "@/utils/string.utils";

const staticData: StaticData = staticDataRaw as StaticData;

const steps = staticData?.steps || [];
const subItems = staticData?.subItems || [];

const Process = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const handleNext = () => {
    setActiveStep((prev) => (prev + 1) % steps.length);
  };

  const handlePrev = () => {
    setActiveStep((prev) => (prev - 1 + steps.length) % steps.length);
  };

  return (
    <AnimatedWrapper animationType={"top"} threshold={0.7} duration={3}>
      <main className="bg-white">
        <section
          className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20"
          aria-labelledby="process-heading"
        >
          <header className="text-center mb-12">
            <h1
              id="process-heading"
              className="text-black font-[500] text-[30px] sm:text-[48px] font-inter mb-4"
            >
              How Our Process Works
            </h1>

            {/* Sublites Navigation */}
            <SubItemTabs
              subItems={subItems as any}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
            />
          </header>

          {/* Desktop Gallery (Large Screens) */}
          <div
            className="hidden md:flex gap-2 h-[600px] transition-all duration-500 ease-in-out"
            role="region"
            aria-labelledby="process-steps"
          >
            <h2 id="process-steps" className="sr-only">
              Process Steps
            </h2>
            {steps.map((step, index) => (
              <article
                key={step.id}
                className={`relative overflow-hidden rounded-3xl transition-all duration-500 ease-in-out cursor-pointer ${
                  index === activeStep
                    ? "flex-grow"
                    : "flex-grow-0 hover:flex-grow"
                }`}
                onMouseEnter={() => setActiveStep(index)}
                style={{
                  flexBasis: index === activeStep ? "550px" : "200px",
                }}
              >
                <Image
                  fill
                  src={step.image}
                  alt={step.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="mb-2">
                      <span
                        className="text-[14px] font-[400] font-inter bg-gray-50/20 px-2 py-1 rounded-2xl text-white"
                        aria-hidden="true"
                      >
                        STEP {step.id}
                      </span>
                    </div>
                    <h3 className="text-[24px] font-[600] mb-2 uppercase font-inter">
                      {index !== activeStep
                        ? truncateByLetters(step.title, 6)
                        : step.title}
                    </h3>
                    <p
                      className={`text-sm text-gray-200 transition-all duration-500 text-[14px] font-[400] font-inter `}
                      aria-hidden={index !== activeStep ? true : undefined}
                    >
                      {index !== activeStep
                        ? truncateByWords(step.description, 9)
                        : step.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Mobile Carousel (Small Screens) */}
          <div className="md:hidden relative w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.5 }}
                className="relative w-full h-[500px] rounded-3xl overflow-hidden"
              >
                <Image
                  fill
                  src={steps[activeStep].image}
                  alt={steps[activeStep].title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="mb-2">
                      <span
                        className="text-[14px] font-[400] font-inter bg-gray-50/20 px-2 py-1 rounded-2xl text-white"
                        aria-hidden="true"
                      >
                        STEP {steps[activeStep].id}
                      </span>
                    </div>
                    <h3 className="text-[24px] font-[600] mb-2 uppercase font-inter">
                      {steps[activeStep].title}
                    </h3>
                    <p className="text-[14px] font-[400] font-inter text-gray-200">
                      {steps[activeStep].description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div
              className="absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between px-4"
              aria-label="Carousel navigation"
            >
              <button
                onClick={handlePrev}
                className="bg-white/20 backdrop-blur-sm p-2 rounded-full z-10 hover:bg-white/30 transition-all"
                aria-label="Previous step"
              >
                <ChevronLeft className="text-white" size={24} />
              </button>
              <button
                onClick={handleNext}
                className="bg-white/20 backdrop-blur-sm p-2 rounded-full z-10 hover:bg-white/30 transition-all"
                aria-label="Next step"
              >
                <ChevronRight className="text-white" size={24} />
              </button>
            </div>

            {/* Dot Indicators */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`
                  w-3 h-3 rounded-full transition-all duration-300
                  ${index === activeStep ? "bg-[#01414A] w-6" : "bg-white/50"}
                `}
                  aria-label={`Go to step ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </AnimatedWrapper>
  );
};

export default Process;
