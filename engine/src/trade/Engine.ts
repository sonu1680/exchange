import { RedisManager } from "../RedisManager";
import { MessageFromApi, OrderSide } from "../types";
import { Order, Orderbook } from "./Orderbook";
import fs from "fs";

export class Engine {
  private orderbooks: Orderbook[] = [];

  constructor() {
    this.orderbooks = [new Orderbook(`SOL`, [], [], 0, 0)];

    setInterval(() => {
      this.saveSnapshot();
    }, 1000 * 1);
  }

  saveSnapshot() {
    const snapshotSnapshot = {
      orderbooks: this.orderbooks.map((o) => o.getSnapShot()),
      //balances: Array.from(this.balances.entries()),
    };
    fs.writeFileSync("./snapshot.json", JSON.stringify(snapshotSnapshot));
  }
  process(data: MessageFromApi) {
    const message = data.message;
    const msgId = data.msgId;
    switch (message.type) {
      case "CREATE_ORDER":
        const { executedQty, fills } = this.createOrder(
          message.data.market,
          message.data.price,
          message.data.quantity,
          message.data.side,
          message.data.userId
        );
        RedisManager.getInstance().sendToApi({
          msgId: msgId,
          message: {
            executedQty,
            fills,
          },
        });
    }
  }

  createOrder(
    market: string,
    price: number,
    quantity: number,
    side: OrderSide,
    userId: string
  ) {
    const orderbook = this.orderbooks.find((o) => o.ticker() === market);
    const a=orderbook?.getDepth()
    const baseAsset = market.split("_")[0];
    const quoteAsset = market.split("_")[1];
    if (!orderbook) {
      throw new Error("No orderbook found");
    }
    //  this.checkAndLockFunds(
    //    baseAsset,
    //    quoteAsset,
    //    side,
    //    userId,
    //    quoteAsset,
    //    price,
    //    quantity
    //  );

    const order: Order = {
      price: Number(price),
      quantity: Number(quantity),
      orderId:
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15),
      filled: 0,
      side,
      userId,
    };

    const { executedQty, fills } = orderbook.addOrder(order);
    //console.log(res)
//    console.log(this.orderbooks[0].bids);
    return { executedQty, fills };
  }
}
