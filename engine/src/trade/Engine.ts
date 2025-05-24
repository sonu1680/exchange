import { RedisManager } from "../RedisManager";
import { MessageFromApi, OrderBook, OrderSide } from "../types";

export class Engine {
  private orderbook: OrderBook;

  constructor() {
    this.orderbook = {
      ASKS: {
        sol: [
          {
            price: 27000.5,
            quantity: 0.25,
            userId: "user123",
            side: "BUY",
          },
          {
            price: 27100.0,
            quantity: 0.5,
            userId: "user234",
            side: "BUY",
          },
        ],
      },
      BIDS: {
        sol: [
          {
            price: 27000.5,
            quantity: 0.25,
            userId: "user123",
            side: "SELL",
          },
          {
            price: 26980.0,
            quantity: 0.4,
            userId: "user234",
            side: "SELL",
          },
        ],
      },
    };
  }

  process({
    clientId,
    message,
  }: {
    clientId: string;
    message: MessageFromApi;
  }) {
    switch (message.type) {
      case "CREATE_ORDER":
        const res = this.createOrder(
          message.data.market,
          message.data.price,
          message.data.quantity,
          message.data.side,
          message.data.userId,
          message.data.type,
          clientId
        );
    }
  }

   createOrder(
    market: string,
    price: number,
    quantity: number,
    side: OrderSide,
    userId: string,
    type: string,
     clientId:string
  ) {
    if (side == OrderSide.BUY) {
      const ticker = this.orderbook.ASKS[market];
      const a = ticker.map((o) => {
        if (o.price <= price && o.userId != userId) {
          console.log(o)
          let remainingQuantity = o.quantity - quantity;
          let filledQuantity = 0;
          if (remainingQuantity < 0) {
            remainingQuantity = Math.abs(remainingQuantity);
            filledQuantity = o.quantity;
             RedisManager.getInstance().sendToApi({
               clientId,
               message: JSON.stringify({
                 filledQuantity: filledQuantity,
                 remainingQuantity: remainingQuantity,
               }),
             });
             console.log(o);

            //add remin on order book

          } else {
            //redis fill quanti with order id
          }
        }
      });
      //console.log(a);
    } else if (side == OrderSide.SELL) {
      console.log("sell");
    }
  }
}
