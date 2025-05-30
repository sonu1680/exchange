import { createClient } from "redis";
import { Engine } from "./trade/Engine";

async function main() {
  const engine = new Engine();

  const redisClient = createClient();

  redisClient.on("error", (err) => console.error("Redis Client Error", err));

  await redisClient.connect();
  console.log("Redis connected");

  while (true) {
    try {
      const res = await redisClient.rPop("message");
      if (res) {
        console.log(" engine indexjs")
        
        engine.process(JSON.parse(res));
      } else {
        await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms delay
      }
    } catch (err) {
      console.error("Error processing message:", err);
    }
  }
}

main().catch((err) => {
  console.error("Fatal error in main:", err);
});
