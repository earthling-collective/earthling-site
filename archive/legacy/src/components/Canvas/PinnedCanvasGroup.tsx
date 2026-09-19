import React, { useEffect, useContext, useRef } from "react";
import { CanvasContext, PinnedItem } from ".";

export default (
  props: React.HTMLAttributes<HTMLDivElement> &
    Omit<PinnedItem, "id" | "anchor" | "renderer"> & {
      children: PinnedItem["renderer"];
    }
) => {
  const {
    children,
    layer,
    align,
    justify,
    fit,
    flipY,
    referenceSize,
    ...passthrough
  } = props;
  const { pinToCanvas, unpinFromCanvas } = useContext(CanvasContext);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rootRef.current) {
      const item = pinToCanvas({
        anchor: rootRef.current,
        layer,
        align,
        justify,
        fit,
        flipY,
        referenceSize,
        renderer: children,
      });
      return () => {
        unpinFromCanvas(item.id);
      };
    }
  }, [
    rootRef,
    pinToCanvas,
    unpinFromCanvas,
    referenceSize,
    layer,
    justify,
    align,
    flipY,
    fit,
    children,
  ]);

  return <div ref={rootRef} {...passthrough} />;
};
