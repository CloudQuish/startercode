import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ISubItemTabsProps } from "@/interfaces/subitem.interface";

const SubItemTabs: React.FC<ISubItemTabsProps> = ({
  subItems,
  activeStep,
  setActiveStep,
}) => {
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.offsetWidth;
      const maxScroll =
        containerRef.current.scrollWidth - containerRef.current.offsetWidth;

      const newScrollPosition =
        direction === "left"
          ? Math.max(0, scrollPosition - scrollAmount)
          : Math.min(maxScroll, scrollPosition + scrollAmount);

      containerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      });

      setScrollPosition(newScrollPosition);
    }
  };

  const handleButtonClick = (index: number) => {
    setActiveStep(index);

    if (containerRef.current) {
      const button = containerRef.current.children[0].children[
        index
      ] as HTMLElement;

      button.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  return (
    <div className="relative w-full">
      {/* Small Devices Slider */}
      <div className="md:hidden relative w-full">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
          <button
            onClick={() => handleScroll("left")}
            className="bg-white/50 backdrop-blur-sm rounded-full p-1 shadow-md"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="text-[#01414A]" />
          </button>
        </div>
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
          <button
            onClick={() => handleScroll("right")}
            className="bg-white/50 backdrop-blur-sm rounded-full p-1 shadow-md"
            aria-label="Scroll Right"
          >
            <ChevronRight className="text-[#01414A]" />
          </button>
        </div>
        <div
          ref={containerRef}
          className="overflow-x-scroll scrollbar-hide whitespace-nowrap snap-x snap-mandatory"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <div className="inline-flex px-4 py-2 gap-4 bg-[#0367750F]/5 rounded-full">
            {subItems.map((item, index) => (
              <button
                key={item.id}
                className={`px-4 py-2 rounded-full font-[500] text-[14px] sm:text-[16px] 
                  font-inter transition-all duration-300 snap-center ${
                    index === activeStep
                      ? "text-white bg-[#01414A]"
                      : "text-black hover:bg-gray-200"
                  }`}
                onClick={() => handleButtonClick(index)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Large Screens - Original Design */}
      <div className="hidden md:block">
        <div className="sm:px-4 py-2 rounded-full justify-center gap-x-4 lg:gap-x-8 inline-flex flex-wrap bg-[#0367750F]/5">
          {subItems.map((item, index) => (
            <button
              key={item.id}
              className={`px-4 py-2 rounded-full font-[500] text-[8px] sm:text-[14px] lg:text-[16px] 
                font-inter transition-all duration-300 ${
                  index === activeStep
                    ? "text-white bg-[#01414A]"
                    : "text-black hover:bg-gray-200"
                }`}
              onClick={() => setActiveStep(index)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubItemTabs;
