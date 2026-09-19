import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default (props: {
  animationKey?: string;
  children: React.ReactNode;
}) => {
  const { animationKey = "default", children } = props;

  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div
        variants={{
          [`${animationKey}-initial`]: {},
          [`${animationKey}-animate`]: {
            transition: { when: "beforeChildren", duration: 0 },
          },
          [`${animationKey}-exit`]: {
            transition: { when: "beforeChildren", duration: 0 },
          },
        }}
        initial={`${animationKey}-initial`}
        animate={`${animationKey}-animate`}
        exit={`${animationKey}-exit`}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
