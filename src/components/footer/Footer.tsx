import { Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import NormalFadeUp from "../animation/NormalFadeUp";
import LeftSlide from "../animation/LeftSlide";
import RightSlide from "../animation/RightSlide";

export default function Footer() {
  return (
    <div
      style={{ background: "url(/houses.jpg) center/cover" }}
      className="h-auto py-6 w-full relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gray-600/70"></div>
      <section className="relative z-20 rounded-3xl p-10 xl:container px-4  bg-primary">
        {/* UPPER PART OF FOOTER */}
        <section className=" grid md:grid-cols-2 px-0 md:px-10 gap-10 lg:px-16">
          {/* QUICK LINKS */}
          <div className=" flex flex-row gap-6 lg:gap-20 ">
            {/* COMPANY */}
            <div>
              <h2 className=" text-xl text-white mb-6 font-medium">Company</h2>
              <ul className=" text-white space-y-4 font-thin text-sm">
                {["About", "Pricing", "Demo"].map((l, idx) => (
                  <NormalFadeUp key={idx} delay={0.2 * (idx + 1)}>
                    <li>
                      {" "}
                      <Link href={"#"}>{l}</Link>
                    </li>
                  </NormalFadeUp>
                ))}
              </ul>
            </div>
            {/* PRICING */}
            <div>
              <h2 className=" text-xl text-white mb-6 font-medium">Pricing</h2>
              <ul className=" text-white space-y-4 font-thin text-sm">
                {["Blog", "Events", "Tool Library"].map((l, idx) => (
                  <NormalFadeUp key={idx} delay={0.2 * (idx + 1)}>
                    <li>
                      {" "}
                      <Link href={"#"}>{l}</Link>
                    </li>
                  </NormalFadeUp>
                ))}
              </ul>
            </div>
            {/* CONTACT US */}
            <div>
              <h2 className=" text-xl text-white mb-6 font-medium">
                Contact Us
              </h2>
              <ul className=" text-white space-y-4 font-thin text-sm">
                {["Terms of Use", "Privacy Policy"].map((l, idx) => (
                  <NormalFadeUp key={idx} delay={0.2 * (idx + 1)}>
                    <li>
                      {" "}
                      <Link href={"#"}>{l}</Link>
                    </li>
                  </NormalFadeUp>
                ))}
              </ul>
            </div>
          </div>

          {/* COMPANY NAME AND MAIL */}
          <div className="">
            <NormalFadeUp delay={0.2}>
              <h2 className=" font-bold text-4xl md:text-6xl xl:text-7xl text-white">
                HonestValue
              </h2>
            </NormalFadeUp>
            <div className=" text-white mt-8 max-w-lg">
              <div>
                <NormalFadeUp delay={0.4}>
                  <h2 className=" cursor-pointer text-sm mb-2">Subscribe</h2>
                </NormalFadeUp>
                <NormalFadeUp delay={0.6}>
                  <p className="text-sm  text-muted-foreground">
                    Join our newsletter to stay up to date on features and
                    releases.
                  </p>
                </NormalFadeUp>
              </div>
              {/* SUBSCRIBE BUTTON */}
              <NormalFadeUp delay={0.8}>
                <div className=" mt-6  w-[320px]  justify-between  md:w-full  lg:w-[400px] xl:w-[400px]  flex  border rounded-2xl p-3 bg-white  items-center gap-3">
                  <div className=" flex items-center gap-2">
                    <div className=" p-2 w-fit rounded-lg bg-gray-100">
                      <Mail className="text-white" />
                    </div>
                    <input
                      className=" text-black w-[120px] md:w-[120px] lg:w-full  focus-within:border-none outline-none"
                      type="text"
                      placeholder="Enter your email"
                    />
                  </div>
                  <button className=" text-white bg-gray-100  p-2 rounded-lg">
                    Subscribe
                  </button>
                </div>
              </NormalFadeUp>

              <NormalFadeUp delay={1}>
                <p className=" text-xs text-muted-foreground mt-4">
                  By subscribing you agree to with our{" "}
                  <span className="text-white underline">Privacy Policy</span>
                </p>
              </NormalFadeUp>
            </div>
          </div>
        </section>

        <hr className=" h-[1px] mt-20 mb-10 w-full bg-muted-foreground" />

        {/* COMPANY SOCIAL MEDIAS */}
        <section className=" text-white text-sm px-2 md:px-10 lg:px-16 flex md:flex-row flex-col gap-4 items-center">
          <div className=" flex items-center gap-4">
            {["Instagram", "LinkedIn", "Twitter", "Github"].map((item, idx) => {
              return (
                <LeftSlide key={idx} delay={0.2 * (idx + 1)}>
                  <Link
                    href={"#"}
                    className=" px-4 py-2 text-xs md:text-sm border border-white rounded-full"
                  >
                    {item}
                  </Link>
                </LeftSlide>
              );
            })}
          </div>
          <RightSlide delay={0.8} className="w-full flex-1">
            <Link
              href={"#"}
              className="flex-1  text-xs md:text-sm flex items-center justify-center gap-1 text-center w-full px-4 py-2 border border-white rounded-full"
            >
              <span>
                <Image
                  src={"/copyright.png"}
                  height={20}
                  width={20}
                  alt="copyright"
                  className=""
                />
              </span>
              All Rights Reserved
            </Link>
          </RightSlide>
        </section>
      </section>
    </div>
  );
}
