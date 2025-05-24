import { Router } from "express";
import { RedisManager } from "../RedisManager";
import { CREATE_ORDER } from "../types";

export const orderRouter = Router();

orderRouter.post("/", async (req, res) => {
  const { market, price, quantity, side, userId } = req.body;
  const response = await RedisManager.getInstance().sendAndAwait({
    type: CREATE_ORDER,
    data: {
      market,
      price,
      quantity,
      side,
      userId,
    },
  });
console.log(response);
  res.send(response);
});
