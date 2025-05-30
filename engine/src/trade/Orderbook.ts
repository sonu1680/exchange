import { OrderSide } from "../types";
const BASE_CURRENCY = "INR";
export interface Order {
  price: number;
  quantity: number;
  orderId: string;
  filled: number;
  side: "BUY"|"SELL";
  userId: string;
}

interface Fill {
  price: string;
  quantity: number;
  tradeId: number;
  otherUserId: string;
  markerOrderId: string;
}

export class Orderbook {
  bids: Order[];
  asks: Order[];
  baseAsset: string;
  quoteAsset: string = BASE_CURRENCY;
  lastTradeId: number;
  currentPrice: number;

  constructor(
    baseAsset: string,
    bids: Order[],
    asks: Order[],
    lastTradeId: number,
    currentPrice: number
  ) {
    this.bids = bids;
    this.asks = asks;
    this.baseAsset = baseAsset;
    this.lastTradeId = lastTradeId || 0;
    this.currentPrice = currentPrice || 0;
  }

  ticker() {
    return `${this.baseAsset}_${this.quoteAsset}`;
  }

  getSnapShot() {
    return {
      baseAsset: this.baseAsset,
      bids: this.bids,
      asks: this.asks,
      lastTradeId: this.lastTradeId,
      currentPrice: this.currentPrice,
    };
  }

  addOrder(order: Order): { executedQty: number; fills: Fill[] } {
   // console.log(this.bids, this.asks);

    //if buying find bid
    if (order.side == "BUY") {
      const { executedQty, fills } = this.matchBid(order);
      order.filled = executedQty;
      if (executedQty == order.quantity) {
        return { executedQty, fills };
      }
      this.bids.push(order);
      return {
        fills,
        executedQty,
      };
    }
    //if selling find ask
    else {
      const { executedQty, fills } = this.matchAsk(order);
      if (executedQty == order.quantity) {
        return {
          fills,
          executedQty,
        };
      }
      this.asks.push(order);
      return {
        fills,
        executedQty,
      };
    }

  }

  matchBid(order: Order): { executedQty: number; fills: Fill[] } {
    const fills: Fill[] = [];
    let executedQty = 0;

    for (let i = 0; i < this.asks.length; i++) {
      if (this.asks[i].price <= order.price && executedQty < order.quantity  && order.userId!=this.asks[i].userId) {
        const filledQty = Math.min(
          order.quantity - executedQty,
          this.asks[i].quantity
        );
        executedQty += filledQty;
        this.asks[i].filled += filledQty;
        fills.push({
          price: this.asks[i].price.toString(),
          quantity: filledQty,
          tradeId: this.lastTradeId++,
          markerOrderId: this.asks[i].orderId,
          otherUserId: this.asks[i].userId,
        });

      }
    }

    for (let i = 0; i < this.asks.length; i++) {
      if (this.asks[i].filled === this.asks[i].quantity) {
        this.asks.splice(i, 1);
        i--;
      }
    }
    return { fills, executedQty };
  }

  matchAsk(order: Order) {
    const fills: Fill[] = [];
    let executedQty = 0;

    for (let i = 0; i < this.bids.length; i++) {
      if (this.bids[i].price >= order.price && executedQty < order.quantity && this.bids[i].userId!=order.userId ) {
        const amountRemaining = Math.min(
          order.quantity - executedQty,
          this.bids[i].quantity
        );
        executedQty += amountRemaining;
        this.bids[i].filled += amountRemaining;
        fills.push({
          price: this.bids[i].price.toString(),
          markerOrderId: this.bids[i].orderId,
          otherUserId: this.bids[i].userId,
          quantity: amountRemaining,
          tradeId: this.lastTradeId++,
        });
      }
    }

    for (let i = 0; i < this.bids.length; i++) {
      if (this.bids[i].quantity == this.bids[i].filled) {
        this.bids.splice(i, 1);
        i--;
      }
    }

    return {
      fills,
      executedQty,
    };
  }

getDepth(){
    const bids:[string,string][]=[]
    const asks:[string,string][]=[]

    const bidObj:{[key:string]:number}={};
    const askObj:{[key:string]:number}={}

    for(let i=0;i<this.bids.length;i++){
        const order=this.bids[i]
        if(!bidObj[order.price]){
            bidObj[order.price]=0;
        }bidObj[order.price]+=order.quantity
    }

for(let i=0;i<this.asks.length;i++){
    const order=this.asks[i]
    if(!askObj[order.price]){
        askObj[order.price]=0;
    }
    askObj[order.price]+=order.quantity;
}
for(const price in bidObj){
    bids.push([price,bidObj[price].toString()])
}

for(const price in askObj){
    asks.push([price,askObj[price].toString()])
}

return {bids,asks}

}

}
