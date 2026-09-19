import React, { useState, useEffect, useCallback } from "react";
import { useThree } from "react-three-fiber";
import _ from "lodash";
import { PinnedItem } from ".";

export default (props: PinnedItem & { scrollY: number }) => {
  const {
    anchor,
    renderer,
    referenceSize,
    justify,
    align,
    fit,
    flipY,
    scrollY,
  } = props;
  const three = useThree();
  const [position, setPosition] = useState<[number, number, number]>();
  const [size, setSize] = useState<[number, number]>();

  const update = useCallback(() => {
    const rect = anchor.getBoundingClientRect();
    const xScale = three.viewport.width / three.size.width;
    const yScale = three.viewport.height / three.size.height;
    const yOffset = three.viewport.height * 0.5;
    const xOffset = three.viewport.width * -0.5;
    setPosition([rect.x * xScale + xOffset, -rect.y * yScale + yOffset, 0]);
    setSize([rect.width * xScale, rect.height * yScale]);
  }, [setPosition, setSize, anchor, three]);

  useEffect(() => {
    update();
  }, [scrollY, update]);
  useEffect(() => {
    const u = () => update();
    window.addEventListener("resize", u);
    return () => {
      window.removeEventListener("resize", u);
    };
  }, [update]);

  if (!position || !size) return null;

  const scaleX = size[0] / referenceSize[0];
  const scaleY = size[1] / referenceSize[1];
  const scale: [number, number] =
    fit === "contain"
      ? [_.min([scaleX, scaleY]) || 0, _.min([scaleX, scaleY]) || 0]
      : fit === "cover"
      ? [_.max([scaleX, scaleY]) || 0, _.max([scaleX, scaleY]) || 0]
      : [scaleX, scaleY];

  const j = justify === "left" ? referenceSize[0] * scale[0] : 0;
  const posX = (size[0] - j) / 2;
  const a = align === "top" ? referenceSize[1] * scale[1] : 0;
  const posY = (size[1] - a) / 2;

  return (
    <group
      position={[position[0] + posX, position[1] - posY, position[2]]}
      scale={[scale[0], scale[1] * (flipY ? -1 : 1), 1]}
    >
      {renderer}
    </group>
  );
};
