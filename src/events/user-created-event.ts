import { Subjects } from "./subjects";

/**
 * An interface for a user created event.
 * @interface
 */
export interface UserCreatedEvent {
  /**
   * The name of the exchange to publish the event to.
   */
  exchange: string;
  /**
   * The routing key to use when publishing the event.
   */
  routingKey: Subjects.UserCreated;
  /**
   * The data to publish with the event.
   */
  data: {
    /**
     * The user's ID.
     */
    id: string;
    /**
     * The user's email address.
     */
    email: string;
    /**
     * The user's full name.
     */
    fullName: string;
    /**
     * The user's username.
     */
    userName: string;
  };
}
