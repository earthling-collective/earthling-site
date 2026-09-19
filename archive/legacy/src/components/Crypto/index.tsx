import styles from "./index.module.scss";
import Currency from "./currency";
import React from "react";
import io from "socket.io-client";

class Component extends React.Component {
  public state: any = {};
  private socket?: SocketIOClient.Socket;

  public componentDidMount() {
    const subscription = [
      "0~Binance~BTC~USDT",
      "0~Binance~ETH~BTC",
      "0~Binance~LTC~BTC",
      "0~Binance~XMR~BTC",
    ];

    this.socket = io("https://streamer.cryptocompare.com/");
    this.socket.emit("SubAdd", { subs: subscription });
    this.socket.on("m", (message: any) => {
      const data = message.split("~");
      const exchange = data[1];
      const currency = data[2];
      const trade = data[4] === "1" ? "buy" : data[4] === "2" ? "sell" : null;
      const price = data[8];

      const stateUpdate: any = {};
      stateUpdate[exchange + "_" + currency + "_price"] = price;
      stateUpdate[exchange + "_" + currency + "_trade"] = trade;
      this.setState(stateUpdate);
    });
  }

  public componentWillUnmount() {
    if (this.socket) this.socket.disconnect();
  }

  public render() {
    return (
      <div className={styles.crypto}>
        <Currency
          name="BTC"
          usd_price={"$" + this.state.Binance_BTC_price}
          trade={this.state.Binance_BTC_trade}
        />
        <Currency
          name="ETH"
          usd_price={
            "$" +
            Math.round(
              this.state.Binance_ETH_price * this.state.Binance_BTC_price * 100
            ) /
              100
          }
          trade={this.state.Binance_ETH_trade}
        />
        <Currency
          name="LTC"
          usd_price={
            "$" +
            Math.round(
              this.state.Binance_LTC_price * this.state.Binance_BTC_price * 100
            ) /
              100
          }
          trade={this.state.Binance_LTC_trade}
        />
        <Currency
          name="XMR"
          usd_price={
            "$" +
            Math.round(
              this.state.Binance_XMR_price * this.state.Binance_BTC_price * 100
            ) /
              100
          }
          trade={this.state.Binance_XMR_trade}
        />
      </div>
    );
  }
}

export default Component;
