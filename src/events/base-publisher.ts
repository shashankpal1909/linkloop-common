import { Channel, Connection } from "amqplib";

import { Subjects } from "./subjects";

interface Event {
  exchange: string;
  routingKey: Subjects;
  data: any;
}

/**
 * Base class for publishing messages to an AMQP exchange.
 */
export abstract class Publisher<T extends Event> {
  protected connection: Connection;
  protected channel!: Channel;

  abstract exchange: T["exchange"];
  abstract routingKey: T["routingKey"];

  /**
   * Creates a new instance of the BasePublisher class.
   * @param connection - The AMQP connection to use for publishing messages.
   */
  constructor(connection: Connection, channel: Channel) {
    this.connection = connection;
    this.channel = channel;
  }

  /**
   * Publishes a message to an AMQP exchange.
   * @param data - The data to publish as the message body.
   */
  async publish(data: T["data"]): Promise<void> {
    try {
      await this.channel.assertExchange(this.exchange, "direct", {
        durable: true,
      });
      const message = Buffer.from(JSON.stringify(data));
      this.channel.publish(this.exchange, this.routingKey, message);
      console.log(
        `Message published to exchange '${this.exchange}' with routing key '${this.routingKey}'`
      );
    } catch (error: unknown) {
      console.error("Error publishing message:", error);
    }
  }
}
