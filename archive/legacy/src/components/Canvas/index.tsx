import React, { createContext, useState, useCallback, useContext } from "react";
import styles from "./index.module.scss";
import _ from "lodash";
import { Canvas } from "react-three-fiber";
import PinnedCanvasGroupRenderer from "./PinnedCanvasGroupRenderer";
import Effects from "./Effects";
import { ScrollerContext } from "../Scroller";

export type PinnedItem = {
  id: number;
  anchor: HTMLElement;
  layer: "foreground" | "background";
  referenceSize: [number, number];
  fit?: "contain" | "cover" | "stretch";
  justify?: "center" | "left";
  align?: "center" | "top";
  flipY?: boolean;
  renderer: React.ReactNode;
};

export type CanvasContextType = {
  pinToCanvas: (item: Omit<PinnedItem, "id">) => PinnedItem;
  unpinFromCanvas: (id: number) => void;
};

const defaultValue: CanvasContextType = {
  pinToCanvas: _.noop as any,
  unpinFromCanvas: _.noop as any,
};

export const CanvasContext = createContext(defaultValue);

var ID = 0;

export default (props: { children: React.ReactNode }) => {
  const { children } = props;
  const [groups, setGroups] = useState<PinnedItem[]>([]);
  const { scrollY } = useContext(ScrollerContext);

  const pinToCanvas = useCallback(
    (item: Omit<PinnedItem, "id">) => {
      const newPinnedItem = {
        id: ++ID,
        ...item,
      };
      setGroups((g) => _.uniqBy([newPinnedItem, ...g], "id"));
      return newPinnedItem;
    },
    [setGroups]
  );
  const unpinFromCanvas = useCallback(
    (id: number) => {
      setGroups((g) => _.filter(g, (o) => o.id !== id));
    },
    [setGroups]
  );

  return (
    <CanvasContext.Provider value={{ pinToCanvas, unpinFromCanvas }}>
      <div className={styles.background}>
        <Canvas>
          <ambientLight />
          <Effects />
          {_(groups)
            .filter((g) => g.layer === "background")
            .map((g) => (
              <PinnedCanvasGroupRenderer {...g} scrollY={scrollY} key={g.id} />
            ))
            .value()}
        </Canvas>
      </div>
      <div className={styles.content}>{children}</div>
      <div className={styles.foreground}>
        <Canvas>
          <ambientLight />
          <Effects bloom={false} />
          {_(groups)
            .filter((g) => g.layer === "foreground")
            .map((g) => (
              <PinnedCanvasGroupRenderer {...g} scrollY={scrollY} key={g.id} />
            ))
            .value()}
        </Canvas>
      </div>
    </CanvasContext.Provider>
  );
};
