"use client";

import { IWrapperProps } from "@/interfaces/wrapper.interface";
import { twMerge } from "tailwind-merge";

const Wrapper = ({ children, className, style }: IWrapperProps) => {
  return (
    <section
      className={twMerge("lg:mx-12 px-3 md:px-5  lg:px-7", className)}
      style={style}
    >
      {children}
    </section>
  );
};

export default Wrapper;
