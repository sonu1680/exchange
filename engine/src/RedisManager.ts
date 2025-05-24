import { BasicClientSideCache, createClient, RedisClientType } from "redis";

export class RedisManager {
  private publisher: RedisClientType;
  private static instance: RedisManager;

  constructor() {
    this.publisher = createClient();
    this.publisher.connect();
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new RedisManager();
    }
    return this.instance;
  }

  public sendToApi({ clientId, message }: { clientId:string; message:string }) {
    console.log(clientId,message)

    this.publisher.publish(clientId, message);
  }
}
