import React, { useMemo } from "react";
import styles from "./index.module.scss";
import { TransitionChild } from "../../components/Transtitions";
import Marquee from "../../components/Marquee";
import _ from "lodash";
import PinnedCanvasGroup from "../../components/Canvas/PinnedCanvasGroup";
import { Shape, DoubleSide } from "three";
import { useLoader } from "react-three-fiber";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";

const Path = (props: { shape: Shape }) => {
  const { shape } = props;
  return (
    <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <meshPhongMaterial attach="material" color="white" side={DoubleSide} />
      <shapeBufferGeometry attach="geometry" args={[shape]} />
    </mesh>
  );
};

export default () => {
  const logo = useLoader(SVGLoader, "./media/logo.svg");
  const logoSvg = useMemo(
    () => _.flatten(logo.paths.map((g, i) => g.toShapes(true).map((s) => s))),
    [logo.paths]
  );

  const davinci = useLoader(SVGLoader, "./media/davinci.svg");
  const davinciSvg = useMemo(
    () =>
      _.flatten(davinci.paths.map((g, i) => g.toShapes(true).map((s) => s))),
    [davinci.paths]
  );

  return (
    <TransitionChild type={["fade", "up"]}>
      <div className={styles.root}>
        <div className={styles.topMarquee}>
          <Marquee />
        </div>
        <div className={styles.logo}>
          <PinnedCanvasGroup layer="background" className={styles.logoAnchor}>
            {({ position, size }) => {
              const maxSize = { x: 1692, y: 194 };

              const scaleX = size[0] / maxSize.x;
              const scaleY = size[1] / maxSize.y;
              const scale = _.min([scaleX, scaleY]) || 0;

              const posX = (size[0] - maxSize.x * scale) / 2;
              const posY = (size[1] - maxSize.y * scale) / 2;

              return (
                <group position={position}>
                  <group position={[posX, -posY, 0]} scale={[scale, -scale, 1]}>
                    <ambientLight />
                    {_.map(logoSvg, (shape, i) => (
                      <Path shape={shape} key={i} />
                    ))}
                  </group>
                </group>
              );
            }}
          </PinnedCanvasGroup>
        </div>
        <div className={styles.davinci}>
          <PinnedCanvasGroup
            layer="background"
            className={styles.davinciAnchor}
          >
            {({ position, size }) => {
              const maxSize = { x: 834.27, y: 834.27 };

              const scaleX = size[0] / maxSize.x;
              const scaleY = size[1] / maxSize.y;
              const scale = _.min([scaleX, scaleY]) || 0;

              const posX = (size[0] - maxSize.x * scale) / 2;
              const posY = (size[1] - maxSize.y * scale) / 2;

              return (
                <group position={position}>
                  <group position={[posX, -posY, 0]} scale={[scale, -scale, 1]}>
                    <ambientLight />
                    {_.map(davinciSvg, (shape, i) => (
                      <Path shape={shape} key={i} />
                    ))}
                  </group>
                </group>
              );
            }}
          </PinnedCanvasGroup>
        </div>
        <div className={styles.bottomMarquee}>
          <Marquee direction={"toRight"} />
        </div>
      </div>
    </TransitionChild>
  );
};
