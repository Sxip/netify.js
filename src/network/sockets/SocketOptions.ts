export interface ISocketOptions {
  /**
   * Packet delimiter
   */
  delimiter?: string | number;

  /**
   * Packet buffer size
   */
  bufferSize?: number;

  /**
   * Automatically creates a bigger buffer when needed
   */
  bufferResize: boolean;
}
