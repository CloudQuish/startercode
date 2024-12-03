"use client";
import Hero from "@/components/home/Hero";
import OurImpact from "@/components/home/OurImpact";

import OurProcess from "@/components/home/OurProcess";
import Questions from "@/components/home/Questions";
import dynamic from "next/dynamic";

const OurCustomers = dynamic(() => import("@/components/home/OurCustomers"), {
  ssr: false,
});
export default function Home() {
  return (
    <div className=" overflow-hidden">
      <Hero />
      <OurImpact />
      <OurProcess />
      <OurCustomers />
      <Questions />
    </div>
  );
}
