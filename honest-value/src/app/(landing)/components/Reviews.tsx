"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import staticDataRaw from "../../../statics/staticData.json";
import { ITestimonial, StaticData } from "@/interfaces/static-data.interface";
import AnimatedWrapper from "../../../reusables/AnimatedWrapper";

const staticData: StaticData = staticDataRaw as StaticData;
const testimonials: ITestimonial[] = staticData?.testimonials || [];

const Reviews: React.FC = () => {
  return (
    <AnimatedWrapper animationType="left" duration={3} threshold={0.4}>
      <main className="bg-[#022C2B]">
        <section
          className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20"
          aria-labelledby="reviews-heading"
        >
          <header className="mb-4 flex flex-row flex-wrap justify-between">
            <h2
              id="reviews-heading"
              className="font-inter text-[28px] font-[500] text-white sm:text-[48px] mb-4"
            >
              Read What Our Valuable
              <br />
              Customers Say
            </h2>
            <p
              className="text-[16px] sm:text-[24px] text-white"
              aria-live="polite"
            >
              Using JumboTax saved me thousands in property <br /> taxes
            </p>
          </header>

          <div className="relative overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{ x: ["0%", "-100%"] }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              aria-live="polite"
            >
              {testimonials.concat(testimonials).map((testimonial, index) => (
                <article
                  key={`${testimonial.id}-${index}`}
                  className="flex-shrink-0 w-full sm:w-[calc(50%-18px)] lg:w-[calc(33.333%-16px)] bg-[#F4FFFD] rounded-2xl p-8"
                  role="region"
                  aria-labelledby={`testimonial-${index}`}
                >
                  <div className="p-4">
                    <p
                      id={`testimonial-${index}`}
                      className="text-[#1D1F1E] mb-8"
                    >
                      {testimonial.content}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                          role="img"
                          aria-label={`Image of ${testimonial.name}`}
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {testimonial.name}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </motion.div>
          </div>
        </section>
      </main>
    </AnimatedWrapper>
  );
};

export default Reviews;
