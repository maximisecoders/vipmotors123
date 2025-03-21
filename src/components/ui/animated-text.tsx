"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  text: string;
  className?: string;
  el?: keyof JSX.IntrinsicElements;
  animation?: {
    hidden: {
      opacity: number;
      y: number;
    };
    visible: {
      opacity: number;
      y: number;
    };
  };
  repeatDelay?: number;
}

const defaultAnimations = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export const AnimatedText = ({
  text,
  className,
  el: Wrapper = "div",
  animation = defaultAnimations,
  repeatDelay = 0,
}: Props) => {
  const words = text.split(" ");

  return (
    <Wrapper className={className}>
      <motion.span
        initial="hidden"
        animate="visible"
        transition={{
          staggerChildren: 0.1,
          repeatDelay: repeatDelay,
          repeat: repeatDelay > 0 ? Infinity : 0,
        }}
        className="inline-block"
      >
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            className="inline-block"
            variants={animation}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {word}
            {i !== words.length - 1 && "\u00A0"}
          </motion.span>
        ))}
      </motion.span>
    </Wrapper>
  );
};
