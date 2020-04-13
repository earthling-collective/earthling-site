import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router";

export default (props: {
  animationKey?: string;
  children: React.ReactNode;
}) => {
  const { animationKey = "default", children } = props;
  const location = useLocation();

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
        key={location.pathname}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
