"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Plus,
  Minus,
  MoveDown,
} from "lucide-react";
import Image from "next/image";
import staticDataRaw from "../../../statics/staticData.json";
import { StaticData } from "@/interfaces/static-data.interface";

const staticData: StaticData = staticDataRaw as StaticData;

const Faq: React.FC = () => {
  const [openQuestion, setOpenQuestion] = useState<number | null>(0);

  return (
    <main className="bg-white py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-[1400px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[890px]">
          {/* FAQ Section */}
          <section
            className="bg-[#F6F6F6] rounded-3xl p-8 sm:p-10"
            aria-labelledby="faq-section-heading"
          >
            <header>
              <h2
                id="faq-section-heading"
                className="text-[23px] sm:text-[48px] font-inter font-[500] text-[#022C2B] mb-10 md:mb-16"
              >
                Questions About Our
                <br />
                JumboTax?
              </h2>
            </header>

            <div className="space-y-4">
              {staticData?.faqs?.map((faq) => (
                <article
                  key={faq.id}
                  className="border-b border-gray-200 pb-4"
                  aria-labelledby={`faq-${faq.id}`}
                >
                  <button
                    className="w-full flex justify-between items-center text-left"
                    onClick={() =>
                      setOpenQuestion(openQuestion === faq.id ? null : faq.id)
                    }
                    aria-expanded={openQuestion === faq.id}
                    aria-controls={`faq-answer-${faq.id}`}
                  >
                    <span className="text-[12px] sm:text-[20px] text-black font-inter font-[500]">
                      {faq.question}
                    </span>
                    <span className="ml-2 flex-shrink-0 text-[#036775]">
                      {openQuestion === faq.id ? (
                        <Minus className="h-5 w-5 sm:h-6 sm:w-6 border-[#036775] rounded-full border-2" />
                      ) : (
                        <Plus className="h-5 w-5 sm:h-6 sm:w-6 border-[#036775] rounded-full border-2" />
                      )}
                    </span>
                  </button>
                  {openQuestion === faq.id && (
                    <div
                      id={`faq-answer-${faq.id}`}
                      className="mt-4 text-[12px] sm:text-[16px] text-opacity-60 text-black font-inter font-[400]"
                    >
                      {faq.answer}
                    </div>
                  )}
                </article>
              ))}
            </div>

            <div className="mt-8 text-end">
              <p className="text-[#022C2B] font-inter sm:text-[24px] font-[400]">
                We&apos;ve got answers. If you have some other{" "}
                <br className="sm:block hidden" /> questions, feel free to{" "}
                <a href="#" className="text-[#004D40] underline">
                  contact us
                </a>
                .
              </p>
            </div>
          </section>

          {/* Evaluation Section */}
          <section
            className="border rounded-3xl p-8 sm:p-10 relative max-w-[550px] overflow-x-hidden lg:h-auto h-[540px]"
            aria-labelledby="evaluation-section-heading"
          >
            <header>
              <h2
                id="evaluation-section-heading"
                className="leading-snug text-[25px] sm:text-[45px] lg:text-[64px] font-[500] font-inter text-black mb-8"
              >
                Evaluate Your <br className="lg:block hidden" />
                Potential <br className="lg:block hidden" /> Savings
              </h2>
            </header>

            <ul className="space-y-2 mb-8">
              {staticData?.benefits?.map((benefit, index) => (
                <li
                  key={index}
                  className="flex items-center text-gray-600 text-[14px]"
                >
                  <span className="w-1.5 h-1.5 bg-[#004D40] rounded-full mr-3"></span>
                  {benefit}
                </li>
              ))}
            </ul>

            <button className="animate-bounce bg-[linear-gradient(0deg,_#171717_26.25%,_#7D7D7D_256.25%)] text-white rounded-full h-[42px] w-[241px] px-8 py-4 flex items-center justify-center space-x-2 hover:bg-gray-800 transition-colors">
              <span>Join Now</span>
              <ArrowRight className="h-5 w-5 -rotate-45 mb-1 font-bold" />
            </button>

            <div className="mt-12 lg:mt-48 border py-4 px-6 rounded-xl">
              <p className="text-sm text-gray-500 mb-4">
                Join +1 Million Users Around The World
              </p>
              <div className="flex -space-x-2">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"
                  />
                ))}
              </div>
            </div>

            {/* Background Decoration */}
            <div className="hidden lg:block absolute top-32 -right-72 w-[500px] h-[535px] z-10">
              <Image src={"/images/mask.png"} alt="mask" fill />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Faq;
