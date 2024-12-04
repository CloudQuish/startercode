"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import staticDataRaw from "../../../statics/staticData.json";
import { StaticData } from "@/interfaces/static-data.interface";
import { motion } from "framer-motion";
import AnimatedWrapper from "../../../reusables/AnimatedWrapper";

const staticData: StaticData = staticDataRaw as StaticData;

const Impact: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <main className="bg-[#0367750F]/5 rounded-[50px] flex items-center justify-center">
      <section className="sm:px-6 py-20 lg:mx-12 px-3 md:px-5 lg:px-7 max-w-[1400px] mx-auto">
        <div className={`space-y-16 transition-all duration-1000`}>
          {/* Header */}
          <AnimatedWrapper animationType="left" duration={2} threshold={0.6}>
            <header className="text-center space-y-6 sm:space-y-12">
              <h2
                className="text-[16px] font-semibold text-[#01414A] tracking-wide uppercase font-inter"
                aria-label="Our Impact"
              >
                OUR IMPACT
              </h2>
              <h3 className="text-[30px] sm:text-[48px] font-[500] text-black sm:text-5xl font-inter">
                Why Reach Out To JumboTax?
              </h3>
              <p className="max-w-4xl mx-auto font-[400px] text-[16px] text-black">
                Reaching out to JumboTax ensures you pay property taxes that
                truly reflect your property&apos;s value. With our AI-driven
                expertise, we navigate the intricate landscape of property tax
                appeals. Simply share your property details, and our intelligent
                system ensures you&apos;re not overpaying a dime. Partner with
                JumboTax for fair property tax.
              </p>
            </header>
          </AnimatedWrapper>

          {/* Stats */}
          <section
            aria-labelledby="impact-stats"
            className="flex items-center justify-center gap-x-4 flex-wrap gap-y-6 flex-shrink"
          >
            {staticData?.stats?.map((stat, index) => (
              <article
                key={index}
                className="relative group bg-white rounded-2xl shadow-xl flex justify-center items-center h-[220px] w-[280px] hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                aria-labelledby={`stat-${index}`}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-600 to-green-600 rounded-2xl opacity-0 group-hover:opacity-10 transition duration-300" />
                <div className="space-y-2 text-center">
                  {/* Typing animation */}
                  <motion.p
                    id={`stat-value-${index}`}
                    className="text-[60px] font-inter font-[600] text-[#01414A]"
                    initial={{ width: 0 }}
                    animate={{ width: "auto" }}
                    transition={{
                      duration: 3,
                      ease: "easeOut",
                      repeat: Infinity,
                    }}
                    style={{ whiteSpace: "nowrap", overflow: "hidden" }}
                  >
                    {stat.value}
                  </motion.p>
                  <p
                    className="text-[16px] font-inter font-[500] text-[#01414A]"
                    aria-describedby={`stat-value-${index}`}
                  >
                    {stat.label}
                  </p>
                </div>
              </article>
            ))}
          </section>

          {/* Features */}
          <section
            aria-labelledby="features-section"
            className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 mx-2"
          >
            {staticData?.features?.map((feature, index) => (
              <AnimatedWrapper
                key={index}
                animationType={"top"}
                threshold={0.2 * index + 1 / 2}
                duration={index + 1 - 0.7}
              >
                <article
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                  aria-labelledby={`feature-${index}`}
                >
                  <div className="aspect-w-16 aspect-h-9 flex items-center justify-center">
                    <Image
                      width={400}
                      height={400}
                      src={feature.image}
                      alt={feature.title}
                      className="w-[400px] h-[281px]"
                    />
                  </div>
                  <div className="p-6 space-y-4 bg-[#03677526]/15 text-center">
                    <h4
                      className="font-[500] font-inter text-black text-[20px]"
                      id={`feature-title-${index}`}
                    >
                      {feature.title}
                    </h4>
                    <p
                      className="text-black text-opacity-60 leading-relaxed font-inter"
                      aria-describedby={`feature-title-${index}`}
                    >
                      {feature.description}
                    </p>
                  </div>
                </article>
              </AnimatedWrapper>
            ))}
          </section>
        </div>
      </section>
    </main>
  );
};

export default Impact;
