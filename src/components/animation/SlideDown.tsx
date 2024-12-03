"use client";
import { motion, useInView } from "framer-motion";
import { ReactNode, useRef } from "react";

export default function SlideDown({
  children,
  delay = 0.1,
  duration = 0.5,
  className = "",
  id = "",
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  id?: string;
}) {
  const ref = useRef(null);

  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: -200, filter: "blur(20px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={
        inView ? { delay, duration, type: "spring", stiffness: 90 } : {}
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}
