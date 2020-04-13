import React, { useEffect, useContext, useRef } from "react";
import { CanvasContext, PinnedItem } from ".";

export default (
  props: React.HTMLAttributes<HTMLDivElement> & {
    layer: PinnedItem["layer"];
    children: PinnedItem["renderer"];
  }
) => {
  const { children, layer, ...passthrough } = props;
  const { pinToCanvas, unpinFromCanvas } = useContext(CanvasContext);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rootRef.current) {
      const item = pinToCanvas(rootRef.current, layer, children);
      return () => {
        unpinFromCanvas(item.id);
      };
    }
  }, [rootRef, pinToCanvas, unpinFromCanvas, layer, children]);

  return <div ref={rootRef} {...passthrough} />;
};
