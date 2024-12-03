"use client";
import DiagramBuilder from "@/components/diagram/DiagramBuilder";
import React, { useCallback } from "react";

export default function page() {
  return (
    <div>
      <section className=" min-h-screen text-white h-[100vh] w-full border-4 ">
        <DiagramBuilder />
      </section>
    </div>
  );
}
