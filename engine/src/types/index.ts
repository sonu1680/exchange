export enum OrderSide{
    BUY="BUY",
    SELL="SELL"

}


export interface MessageFromApi {
    type:string,
    data:{

        market: string;
        price: number;
        quantity: number;
        side: OrderSide;
        userId: string;
        type: string;
    }
}

export interface Order {
  price: number;
  quantity: number;
  userId: string;
  side: "BUY"|"SELL";
}

export interface OrderBookSide {
  [market: string]: Order[];
}

export interface OrderBook {
  ASKS: OrderBookSide;
  BIDS: OrderBookSide;
}