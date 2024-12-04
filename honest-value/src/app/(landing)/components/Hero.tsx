import AnimatedWrapper from "../../../reusables/AnimatedWrapper";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";

const Hero: React.FC = () => {
  return (
    <div className="bg-white pb-8 lg:pb-14">
      <div className="flex flex-col items-center lg:mx-12 px-3 md:px-5 lg:px-7">
        <div className="flex flex-col w-full justify-center items-center relative">
          <div>
            <AnimatedWrapper animationType="left" duration={1} threshold={0}>
              <figure>
                <Image
                  width={4000}
                  height={4000}
                  src={"/images/heroImage.png"}
                  alt="Hero image"
                  className="object-cover h-[400px] md:h-[785px] rounded-[40px] brightness-50"
                />
              </figure>
            </AnimatedWrapper>
            <AnimatedWrapper animationType="right" duration={2} threshold={0.4}>
              <div className="lg:flex justify-end absolute -right-0 bottom-0 hidden">
                <div className="bg-white w-[600px] h-[180px] rounded-tl-[40px] flex justify-start gap-x-16 pl-12 pt-4 z-10">
                  <div>
                    <div className="flex items-center gap-x-2">
                      <div className="text-[#1A1A1A] font-[500] text-[48px] font-inter">
                        80%
                      </div>
                      <ArrowRight
                        size={38}
                        className="-rotate-45 text-[#01DC82] p-1 rounded-full bg-[#01DC82]/20"
                      />
                      <div className="text-[#01DC82] text-[20px]">54%</div>
                    </div>
                    <div className="text-[#787878] text-center font-inter text-[16px]">
                      Use of Recycled <br /> Materials
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-x-2">
                      <div className="text-[#1A1A1A] font-[500] text-[48px] font-inter">
                        65%
                      </div>
                      <ArrowLeft
                        size={38}
                        className="-rotate-45 text-[#DC0101] p-1 rounded-full bg-[#DC0101]/20"
                      />
                      <div className="text-[#DC0101] text-[20px] font-inter">
                        35%
                      </div>
                    </div>
                    <div className="text-[#787878] text-[16px] text-center font-inter">
                      Carbon Emission Reduction
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedWrapper>
            <AnimatedWrapper animationType="fade" duration={2} threshold={1}>
              <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 px-4 sm:pl-8 md:pl-24">
                <div className="text-white space-y-4 sm:space-y-6 lg:space-y-8">
                  <h1 className="text-2xl 400:text-2xl sm:text-5xl lg:text-6xl xl:text-[80px] font-normal font-inter leading-tight">
                    One Step Away <br />
                    From HonestValue
                  </h1>
                  <p className="font-inter text-xs sm:text-sm md:text-base lg:text-[16px] md:max-w-[600px] text-wrap 500:max-w-[300px]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    viverra ante vel lectus consectetur vestibulum. In cursus
                    dictum nibh molestie pretium.
                  </p>
                  <button className="flex items-center rounded-full px-4 py-2 sm:px-6 sm:py-4 bg-white gap-x-2 sm:gap-x-4">
                    <span className="text-[#003B3E] text-xs sm:text-base font-inter">
                      Get Started
                    </span>
                    <ArrowRight className="-rotate-45 text-[#003B3E] size-4 sm:size-5" />
                  </button>
                </div>
              </div>
            </AnimatedWrapper>
          </div>
        </div>

        <div className="lg:hidden justify-end flex">
          <div className="rounded-[40px] bg-slate-50 py-2 px-4 -mt-2 450:-mt-8 flex justify-start gap-x-6 sm:gap-x-8 md:gap-x-16 sm:pl-8 md:pl-12 pt-4 z-10">
            <div>
              <div className="flex items-center gap-x-1 sm:gap-x-2 justify-center">
                <div className="text-[#1A1A1A] font-[500] text-[18px] 450:text-[36px] md:text-[48px] font-inter">
                  80%
                </div>
                <ArrowRight
                  size={24}
                  className="-rotate-45 text-[#01DC82] p-1 rounded-full bg-[#01DC82]/20 450:w-[24px] 450:h-[24px]"
                />
                <div className="text-[#01DC82] text-[9px] sm:text-[16px] md:text-[20px] font-inter">
                  54%
                </div>
              </div>
              <div className="text-[#787878] text-center text-[10px] sm:text-[12px] md:text-[16px] font-inter">
                Use of Recycled Materials
              </div>
            </div>
            <div>
              <div className="flex items-center gap-x-1 sm:gap-x-2 justify-center">
                <div className="text-[#1A1A1A] font-[500] text-[18px] 450:text-[36px] md:text-[48px] font-inter">
                  65%
                </div>
                <ArrowRight
                  size={24}
                  className="-rotate-45 text-[#DC0101] p-1 rounded-full bg-[#DC0101]/20 450:w-[24px] 450:h-[24px]"
                />
                <div className="text-[#DC0101] text-[9px] sm:text-[16px] md:text-[20px] font-inter">
                  35%
                </div>
              </div>
              <div className="text-[#787878] text-center text-[10px] sm:text-[12px] md:text-[16px] font-inter">
                Carbon Emission Reduction
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
