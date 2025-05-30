export enum OrderSide{
    BUY="BUY",
    SELL="SELL"

}


export interface MessageFromApi {
    msgId:string,
    message:{
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

}
