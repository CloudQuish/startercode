"use client";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface AnimatedWrapperProps {
  children: React.ReactNode;
  animationType: "left" | "right" | "top" | "bottom" | "fade";
  className?: string;
  duration?: number; // Duration in seconds
  threshold?: number;
  rootMargin?: string;
}

const animationVariants = {
  left: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
  },
  right: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
  },
  top: {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
  },
  bottom: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
};

const AnimatedWrapper: React.FC<AnimatedWrapperProps> = ({
  children,
  animationType = "fade", // Default is fade, but can be changed
  className,
  duration = 0.8,
  threshold = 0.1,
  rootMargin = "0px",
}) => {
  const controls = useAnimation();
  const { ref, inView } = useInView({ threshold, rootMargin });

  // Ensure the animationType exists within the animationVariants object
  const animation = animationVariants[animationType] || animationVariants.fade; // Fallback to fade if invalid type

  useEffect(() => {
    if (inView) {
      controls.start({ ...animation.animate, transition: { duration } });
    }
  }, [controls, inView, animation, duration]);

  return (
    <motion.div
      ref={ref}
      initial={animation.initial}
      animate={controls}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedWrapper;
