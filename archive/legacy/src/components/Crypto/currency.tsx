import React from "react";
import styles from "./index.module.scss";

type Props = {
  name: string;
  trade: string;
  usd_price: string;
};

class Component extends React.Component<Props> {
  public render() {
    const classes = [styles.crypto];
    if (this.props.trade) {
      classes.push("crypto-currency-trade-" + this.props.trade);
    }

    return (
      <div className={classes.join(" ")}>
        <label className={styles.label}>{this.props.name}</label>
        <div className={styles.price}>{this.props.usd_price}</div>
      </div>
    );
  }
}

export default Component;
