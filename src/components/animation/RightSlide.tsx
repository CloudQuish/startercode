"use client";
import { motion, useInView } from "framer-motion";
import { ReactNode, useRef } from "react";
function RightSlide({
  children,
  delay = 0.1,
  duration = 0.5,
  className,
}: {
  children: ReactNode;
  delay?: number;
  height?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef(null);

  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay, duration }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default RightSlide;
