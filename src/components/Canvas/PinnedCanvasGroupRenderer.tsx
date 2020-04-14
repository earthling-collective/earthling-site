import React, { useState, useEffect, useCallback } from "react";
import { useThree } from "react-three-fiber";
import _ from "lodash";
import { PinnedItem } from ".";

export default (props: PinnedItem & { scrollY: number }) => {
  const { anchor, renderer, referenceSize, scrollY } = props;
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
  const scale = _.min([scaleX, scaleY]) || 0;

  const posX = (size[0] - referenceSize[0] * scale) / 2;
  const posY = (size[1] - referenceSize[1] * scale) / 2;

  return (
    <group position={position}>
      <group position={[posX, -posY, 0]} scale={[scale, -scale, 1]}>
        {renderer({ position: [posX, posY, 0], scale: [scale, scale] })}
      </group>
    </group>
  );
};
