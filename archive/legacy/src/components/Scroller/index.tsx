import React, { createContext, useRef, useEffect, useState } from "react";
import styles from "./index.module.scss";
import { smoothScroll, Scroller } from "@smoovy/scroller";
import Canvas from "../Canvas";
import { TransitionChild } from "../Transtitions";

export type ScrollerContextType = {
  scroller?: Scroller;
  scrollY: number;
  virtualScrollY: number;
};

const defaultValue: ScrollerContextType = {
  scrollY: 0,
  virtualScrollY: 0,
};

export const ScrollerContext = createContext(defaultValue);

export default (props: { children: React.ReactNode }) => {
  const { children, ...passthrough } = props;
  const [scroller, setScroller] = useState<Scroller>();
  const [scrollY, setScrollY] = useState(0);
  const [virtualScrollY, setVirtualScrollY] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rootRef.current) {
      const scroller = smoothScroll(rootRef.current, {
        styles: {
          height: "100vh",
        },
      });
      const unlisten = scroller.onScroll((p) => {
        setScrollY(p.y);
      });
      const unlistenVirtual = scroller.onVirtual((p) => {
        setVirtualScrollY(p.y);
      });
      setScroller(scroller);
      return () => {
        unlisten();
        unlistenVirtual();
        scroller.destroy();
      };
    }
  }, [rootRef, setScroller, setScrollY, setVirtualScrollY]);

  return (
    <TransitionChild type={["fade", "up"]}>
      <ScrollerContext.Provider value={{ scroller, scrollY, virtualScrollY }}>
        <Canvas>
          <div className={styles.root} ref={rootRef} {...passthrough}>
            {children}
          </div>
        </Canvas>
      </ScrollerContext.Provider>
    </TransitionChild>
  );
};
