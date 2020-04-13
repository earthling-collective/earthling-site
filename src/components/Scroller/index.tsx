import React, { createContext, useRef, useEffect, useState } from "react";
import styles from "./index.module.scss";
import { smoothScroll, Scroller } from "@smoovy/scroller";
import Canvas from "../Canvas";

export type ScrollerContextType = {
  scroller?: Scroller;
  scrollY: number;
};

const defaultValue: ScrollerContextType = {
  scrollY: 0,
};

export const ScrollerContext = createContext(defaultValue);

export default (props: { children: React.ReactNode }) => {
  const { children, ...passthrough } = props;
  const [scroller, setScroller] = useState<Scroller>();
  const [scrollY, setScrollY] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rootRef.current) {
      const scroller = smoothScroll(rootRef.current, {
        styles: {
          height: "100vh",
        },
      });
      scroller.onVirtual((p) => {
        setScrollY(p.y);
      });
      setScroller(scroller);
      return () => {
        scroller.destroy();
      };
    }
  }, [rootRef, setScroller]);

  return (
    <ScrollerContext.Provider value={{ scroller, scrollY }}>
      <Canvas>
        <div className={styles.root} ref={rootRef} {...passthrough}>
          {children}
        </div>
      </Canvas>
    </ScrollerContext.Provider>
  );
};
