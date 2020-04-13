import React, { createContext, useState, useCallback } from "react";
import styles from "./index.module.scss";
import _ from "lodash";
import { Canvas } from "react-three-fiber";
import PinnedCanvasGroupRenderer from "./PinnedCanvasGroupRenderer";
import Effects from "./Effects";

export type PinnedItem = {
  id: number;
  anchor: HTMLElement;
  layer: "foreground" | "background";
  renderer: (props: {
    position: [number, number, number];
    size: [number, number];
  }) => React.ReactNode;
};

export type CanvasContextType = {
  pinToCanvas: (
    anchor: HTMLElement,
    layer: PinnedItem["layer"],
    renderer: PinnedItem["renderer"]
  ) => PinnedItem;
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

  const pinToCanvas = useCallback(
    (
      anchor: HTMLElement,
      layer: PinnedItem["layer"],
      renderer: PinnedItem["renderer"]
    ) => {
      const newPinnedItem = {
        id: ++ID,
        anchor,
        layer,
        renderer,
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
          <Effects />
          {_(groups)
            .filter((g) => g.layer === "background")
            .map((g) => <PinnedCanvasGroupRenderer {...g} key={g.id} />)
            .value()}
        </Canvas>
      </div>
      <div className={styles.content}>{children}</div>
      <div className={styles.foreground}>
        <Canvas>
          <Effects bloom={false} />
          {_(groups)
            .filter((g) => g.layer === "foreground")
            .map((g) => <PinnedCanvasGroupRenderer {...g} key={g.id} />)
            .value()}
        </Canvas>
      </div>
    </CanvasContext.Provider>
  );
};
