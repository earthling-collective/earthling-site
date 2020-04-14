import React, { useEffect, useContext, useRef } from "react";
import { CanvasContext, PinnedItem } from ".";

export default (
  props: React.HTMLAttributes<HTMLDivElement> & {
    layer: PinnedItem["layer"];
    referenceSize: [number, number];
    children: PinnedItem["renderer"];
  }
) => {
  const { children, layer, referenceSize, ...passthrough } = props;
  const { pinToCanvas, unpinFromCanvas } = useContext(CanvasContext);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rootRef.current) {
      const item = pinToCanvas(rootRef.current, layer, referenceSize, children);
      return () => {
        unpinFromCanvas(item.id);
      };
    }
  }, [rootRef, pinToCanvas, unpinFromCanvas, referenceSize, layer, children]);

  return <div ref={rootRef} {...passthrough} />;
};
