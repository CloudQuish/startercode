"use client";
import { motion, useInView } from "framer-motion";
import { ReactNode, useRef } from "react";

export default function NormalFadeUp({
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
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
