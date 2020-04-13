import React, { useState } from "react";
import { useFrame, useThree } from "react-three-fiber";
import { PinnedItem } from ".";

export default (props: PinnedItem) => {
  const { anchor, renderer } = props;
  const three = useThree();
  const [position, setPosition] = useState<[number, number, number]>();
  const [size, setSize] = useState<[number, number]>();

  useFrame(() => {
    const rect = anchor.getBoundingClientRect();
    const xScale = three.viewport.width / three.size.width;
    const yScale = three.viewport.height / three.size.height;
    const yOffset = three.viewport.height * 0.5;
    const xOffset = three.viewport.width * -0.5;

    setPosition([rect.x * xScale + xOffset, -rect.y * yScale + yOffset, 0]);
    setSize([rect.width * xScale, rect.height * yScale]);
  });

  if (!position || !size) return null;

  return <>{renderer({ position, size })}</>;
};
