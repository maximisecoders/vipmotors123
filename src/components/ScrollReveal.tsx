import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
}

const ScrollReveal = ({ children, direction = "up", delay = 0 }: ScrollRevealProps) => {
  const directions = {
    up: { y: 100 },
    down: { y: -100 },
    left: { x: -100 },
    right: { x: 100 },
  };

  return (
    <motion.div
      initial={{ 
        ...directions[direction], 
        opacity: 0 
      }}
      whileInView={{ 
        x: 0, 
        y: 0, 
        opacity: 1 
      }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.6, 
        delay: delay,
        ease: "easeOut" 
      }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
