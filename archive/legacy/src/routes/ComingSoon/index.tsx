import React, { useMemo } from "react";
import styles from "./index.module.scss";
import "./CustomMaterial";
import _ from "lodash";
import PinnedCanvasGroup from "../../components/Canvas/PinnedCanvasGroup";
import { Shape, DoubleSide } from "three";
import { useLoader } from "react-three-fiber";
import "./CustomMaterial";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import Scroller from "../../components/Scroller";

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

  return (
    <Scroller>
      <div className={styles.root}>
        <div className={styles.logo}>
          <PinnedCanvasGroup
            layer="background"
            referenceSize={[1692, 194]}
            align="top"
            justify="left"
            fit="contain"
            flipY
            className={styles.logoAnchor}
          >
            {_.map(logoSvg, (shape, i) => (
              <Path shape={shape} key={i} />
            ))}
          </PinnedCanvasGroup>
        </div>
      </div>
    </Scroller>
  );
};
