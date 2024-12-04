import AnimatedWrapper from "../../../reusables/AnimatedWrapper";
import React from "react";

const GetStarted: React.FC = () => {
  return (
    <section className="mx-2 mt-80 sm:mt-[480px] lg:mt-[150px] xl:mt-4 mb-12">
      <div className="relative overflow-hidden py-6 sm:py-16 w-full max-w-[1440px] bg-[#171717] rounded-[20px] sm:rounded-[40px] mx-auto px-4 sm:px-8">
        {/* Layout container */}
        <div className="overflow-hidden relative flex flex-col items-center justify-center text-center gap-6 sm:gap-10">
          {/* Header Text */}
          <div>
            <AnimatedWrapper animationType="left" threshold={0.4} duration={3}>
              <p
                className="text-[28px] sm:text-[48px] lg:text-[60px] text-white font-semibold font-inter"
                aria-live="polite"
              >
                95%
              </p>
            </AnimatedWrapper>
            <AnimatedWrapper animationType="right" threshold={0.4} duration={3}>
              <p
                className="text-[16px] sm:text-[24px] font-inter lg:text-[30px] text-white font-medium"
                aria-live="polite"
              >
                of our appeals are successful.
              </p>
            </AnimatedWrapper>
          </div>

          {/* Button */}
          <AnimatedWrapper animationType="left" threshold={0.8} duration={4}>
            <button
              className="animate-pulse px-6 py-3 sm:px-8 sm:py-4 bg-[#EEF0F4] text-[#171717] text-[16px] font-[600] sm:text-[16px] font-inter rounded-[8px] sm:rounded-[12px] shadow-md"
              aria-label="Get Started - It's Free"
            >
              Get Started - It&apos;s Free
            </button>
          </AnimatedWrapper>
        </div>

        {/* Grid lines */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden"
          aria-hidden="true"
        >
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute border-t border-[rgba(145,142,164,0.08)] rotate-90"
              style={{
                left: `${15 * i}%`,
                top: 0,
                height: "100%",
                width: `${100 - i * 10}%`,
              }}
            />
          ))}
        </div>

        {[
          { left: "70%", top: "40%", size: "40px" },
          { left: "15%", top: "25%", size: "50px" },
        ].map((rect, i) => (
          <div
            key={i}
            className="absolute bg-gradient-to-br from-[rgba(255,255,255,0.04)] to-transparent rounded-full"
            style={{
              left: rect.left,
              top: rect.top,
              width: rect.size,
              height: rect.size,
            }}
            aria-hidden="true"
          />
        ))}

        {/* Ellipses */}
        <div className="absolute w-[100px] sm:w-[200px] h-[100px] sm:h-[200px] left-1/2 -translate-x-1/2 top-[calc(100%-50px)] bg-[#EEF0F4] opacity-20 blur-[80px]" />
        <div className="absolute w-[100px] sm:w-[200px] h-[100px] sm:h-[200px] right-[20px] sm:right-[80px] top-[calc(50%-100px)] bg-[#EEF0F4] opacity-20 blur-[80px]" />
      </div>
    </section>
  );
};

export default GetStarted;
