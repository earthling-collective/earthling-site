import React from "react";
import styles from "./index.module.scss";
import Ticker from "react-ticker";
//@ts-ignore
import { usePageVisibility } from "react-page-visibility";

export default (props: { direction?: "toLeft" | "toRight" }) => {
  const { direction = "toLeft" } = props;
  const isVisible = usePageVisibility();

  return (
    <div className={styles.root}>
      {isVisible && (
        <Ticker
          offset={direction === "toRight" ? "100%" : undefined}
          direction={direction}
        >
          {() => <div style={{ paddingRight: 20 }}>Coming Soon</div>}
        </Ticker>
      )}
    </div>
  );
};
