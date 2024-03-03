import { Channel, Connection, Message } from "amqplib";

import { Subjects } from "./subjects";

interface Event {
  exchange: string;
  routingKey: Subjects;
  data: any;
}

/**
 * Base class for message listeners.
 */
export abstract class Listener<T extends Event> {
  protected connection: Connection;
  protected channel: Channel;

  abstract exchange: T["exchange"];
  abstract routingKey: T["routingKey"];
  abstract queue: string;

  /**
   * Creates a new instance of the BaseListener class.
   * @param connection - The AMQP connection to use for listening.
   */
  constructor(connection: Connection, channel: Channel) {
    this.connection = connection;
    this.channel = channel;
  }

  /**
   * Called when a message is received.
   * @param data - The message data.
   * @param msg - The message object.
   */
  abstract onMessage(data: T["data"], msg: Message): void;

  /**
   * Listens for messages on the specified queue.
   */
  async listen(): Promise<void> {
    try {
      await this.channel.assertQueue(this.queue, { durable: true });
      await this.channel.bindQueue(this.queue, this.exchange, this.routingKey);
      this.channel.consume(this.queue, async (message) => {
        if (message) {
          try {
            const data = JSON.parse(message.content.toString());
            console.log(
              `Message received from exchange '${this.exchange}' with routing key '${this.routingKey}'`
            );
            this.onMessage(data, message);
          } catch (error) {
            console.error("Error processing message:", error);
            this.channel.nack(message);
          }
        }
      });
    } catch (error) {
      console.error("Error listening for messages:", error);
    }
  }
}
