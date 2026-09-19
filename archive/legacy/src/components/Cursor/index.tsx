import React, { createContext, useState, useMemo, ReactNode } from "react";
import _ from "lodash";
import styles from "./index.module.scss";
import { ReactComponent as CursorInnerSvg } from "../../assets/cursor-inner.svg";
import { ReactComponent as CursorOuterSvg } from "../../assets/cursor-outer.svg";

export type CursorContextType = {};

const defaultContentType: CursorContextType = {};

export const CursorContext = createContext(defaultContentType);

export default (props: { children: ReactNode }) => {
  const { children } = props;
  const [position, setPosition] = useState<[number, number]>([0, 0]);
  const [outerPosition, setOuterPosition] = useState<[number, number]>([0, 0]);
  const updateInnerPosition = useMemo(
    () =>
      _.throttle((position: [number, number]) => setPosition(position), 10, {
        trailing: true,
      }),
    [setPosition]
  );
  const updateOuterPosition = useMemo(
    () =>
      _.throttle(
        (position: [number, number]) => setOuterPosition(position),
        100,
        {
          trailing: true,
        }
      ),
    [setOuterPosition]
  );
  const updatePosition = useMemo(
    () => (position: [number, number]) => {
      updateInnerPosition(position);
      updateOuterPosition(position);
    },
    [updateInnerPosition, updateOuterPosition]
  );

  return (
    <CursorContext.Provider value={{}}>
      <div
        className={styles.wrapper}
        onMouseMove={(e) => updatePosition([e.clientX, e.clientY])}
      >
        {children}
        <div
          className={styles.outer}
          style={{
            transform: `translate(${outerPosition[0] - 50}px, ${
              outerPosition[1] - 50
            }px)`,
          }}
        >
          <CursorOuterSvg />
        </div>
        <div
          className={styles.inner}
          style={{
            transform: `translate(${position[0] - 50}px, ${
              position[1] - 50
            }px)`,
          }}
        >
          <CursorInnerSvg />
        </div>
      </div>
    </CursorContext.Provider>
  );
};
