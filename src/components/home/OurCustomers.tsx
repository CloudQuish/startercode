"use client";
import React, { useEffect, useMemo } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel";

import { ourCustomers } from "@/__data__/ourCustomers";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";
import NormalFadeUp from "../animation/NormalFadeUp";
import RightSlide from "../animation/RightSlide";
export default function OurCustomers() {
  const isSmall = useMediaQuery(`(max-width:640px)`);
  const islarge = useMediaQuery(`(max-width:1024px) and (min-width:766px)`);
  const isMedium = useMediaQuery(`(max-width:765px)`);

  const [api, setApi] = React.useState<CarouselApi | null | undefined>();
  const [current, setCurrent] = React.useState(0);

  const totalSlides = useMemo(() => ourCustomers.length, [ourCustomers]);

  useEffect(() => {
    if (!api) return;

    // const autoplayInterval = setInterval(() => {
    //   api.scrollNext();
    // }, 5000); // Change slide every 5 seconds

    // return () => clearInterval(autoplayInterval);
  }, [api]);

  useEffect(() => {
    if (api) {
      setCurrent((api?.selectedScrollSnap() % totalSlides) + 1);

      api.on("select", () => {
        setCurrent((api.selectedScrollSnap() % totalSlides) + 1);
      });
    }
  }, [api, totalSlides]);

  //   React.useEffect(() => {
  //     if (!api) {
  //       return;
  //     }

  //     setCurrent(api.selectedScrollSnap() + 1);

  //     api.on("select", () => {
  //       setCurrent(api.selectedScrollSnap() + 1);
  //     });
  //   }, [api]);

  return (
    <div className=" py-12  bg-primary">
      <section className=" xl:container px-4">
        {/* HEADING PART */}
        <div className=" text-white  sm:items-center flex sm:flex-row flex-col justify-between">
          <NormalFadeUp delay={0.2}>
            <h2 className=" text-4xl lg:text-5xl">
              Read What Our Valuable <br /> Customers Say
            </h2>
          </NormalFadeUp>
          <NormalFadeUp delay={0.4}>
            <p className="text-base lg:text-xl">
              {" "}
              “Using JumboTax saved me thousands in property taxes”
            </p>
          </NormalFadeUp>
        </div>

        {/* CAROUSEL */}
        <div className="mt-10">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
            }}
            className="w-full "
          >
            <CarouselContent>
              {ourCustomers.map((testimonial, index) => (
                <CarouselItem
                  key={index}
                  className="md:basis-1/2 lg:basis-3/10"
                >
                  <RightSlide delay={0.3 * (index + 1)}>
                    <div className="p-8 mx-2 bg-white rounded-xl ">
                      <blockquote className="mb-6 text-xs md:text-sm">
                        {testimonial.msg}
                      </blockquote>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={testimonial.picture}
                            alt={testimonial.name}
                            className="object-cover object-top"
                          />
                          <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">
                            {testimonial.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {testimonial.company}
                          </div>
                        </div>
                      </div>
                    </div>
                  </RightSlide>
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="relative w-full h-1 bg-gray-500 mt-10 rounded-full overflow-hidden">
              <div
                className="absolute h-full bg-white transition-all duration-300 ease-in-out rounded-full"
                style={{
                  width: `${200 / ourCustomers.length}%`,
                  left: ` ${
                    islarge
                      ? ((current - 1) / ourCustomers.length) * 100
                      : isMedium
                      ? ((current - 1) / ourCustomers.length) * 90
                      : ((current - 1) / ourCustomers.length) * 120
                  }%`,
                }}
              />
            </div>
          </Carousel>
        </div>
      </section>
    </div>
  );
}
