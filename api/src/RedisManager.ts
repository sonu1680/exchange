import { createClient, RedisClientType } from "redis";

export class RedisManager {
  private client: RedisClientType;
  private publisher: RedisClientType;
  private static instance: RedisManager;

  constructor() {
    this.client = createClient();
    this.client. connect();
    this.publisher = createClient();
    this.publisher.connect();
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new RedisManager();
    }
    return this.instance;
  }

  public sendAndAwait(message: any) {
    return new Promise<any>((resolve) => {
      const id = this.genereatClientId();
      this.client.subscribe(id, (msg) => {
        this.client.unsubscribe(id);
        resolve(JSON.parse(msg));
      });
      this.publisher.lPush(
        "message",
        JSON.stringify({ msgId: id, message })
      );
      
    });
  }

  public genereatClientId(){
    return Math.random().toString(36).substring(2,15)+Math.random().toString(36).substring(2,15);
  }
}
