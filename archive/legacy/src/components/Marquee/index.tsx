import React from "react";
import styles from "./index.module.scss";
import Ticker from "react-ticker";
//@ts-ignore
import { usePageVisibility } from "react-page-visibility";

export default (props: {
  children: React.ReactNode;
  direction?: "toLeft" | "toRight";
}) => {
  const { children, direction = "toLeft" } = props;
  const isVisible = usePageVisibility();

  return (
    <div className={styles.root}>
      {isVisible && (
        <Ticker
          offset={direction === "toRight" ? "100%" : undefined}
          direction={direction}
        >
          {() => children}
        </Ticker>
      )}
    </div>
  );
};
