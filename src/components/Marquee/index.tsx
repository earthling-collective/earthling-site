import React from "react";
import styles from "./index.module.scss";
import Ticker from "react-ticker";

export default (props: { direction?: "toLeft" | "toRight" }) => {
  const { direction = "toLeft" } = props;
  return (
    <div className={styles.root}>
      <Ticker
        offset={direction === "toRight" ? "100%" : undefined}
        direction={direction}
      >
        {() => <div style={{ paddingRight: 20 }}>Coming Soon</div>}
      </Ticker>
    </div>
  );
};
