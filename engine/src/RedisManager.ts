import { BasicClientSideCache, createClient, RedisClientType } from "redis";

export class RedisManager {
  private client: RedisClientType;
  private static instance: RedisManager;

  constructor() {
    this.client = createClient();
    this.client.connect();
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new RedisManager();
    }
    return this.instance;
  }

  public sendToApi({ msgId, message }: { msgId: string; message: any }) {
    this.client.publish(msgId, JSON.stringify(message));
  }
}
