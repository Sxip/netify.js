import { EventEmitter } from 'events';
import { Socket } from 'net';
import { NetifyDelimiterPipe } from '../NetifyDelimiterPipe';

export abstract class SocketHandler extends EventEmitter {
  /**
   * The delimiter stream of this connection
   */
  public stream: NetifyDelimiterPipe;

  protected constructor(
    public readonly socket?: Socket,
  ) {
    super();

    this.socket = socket || new Socket();
  }

  /**
   *  Writes data to the socket connection
   * @param data The data to send to the socket
   */
  public async write(data: Buffer | string): Promise<number> {
    return await new Promise<number>((resolve, reject) => {
      if (!this.socket.writable || this.socket.destroyed) return reject(new Error('Failed to write after end!'));

      const onceError = (error: Error) => {
        reject(error);
      };

      const onceDrain = () => {
        this.socket.off('close', onceClose);
        this.socket.off('error', onceError);
        resolve(data.length);
      };

      const onceClose = () => {
        this.socket.off('drain', onceDrain);
        this.socket.off('error', onceError);
        resolve(data.length);
      };

      if (this.socket.write(data)) {
        this.socket.off('error', onceError);
        return resolve(data.length);
      }

      this.socket.once('close', onceClose);
      this.socket.once('drain', onceDrain);
      this.socket.once('error', onceError);
    });
  }

  /**
   * Removes all of the listeners for stream and socket
   */
  public dispose() {
    this.stream.removeAllListeners();
    this.socket.removeAllListeners();
  }

  /**
   * Destroys the socket connection
   * @param error Optional error
   */
  public destory(error?: Error): Promise<void> {
    if (!this.socket.destroyed) return Promise.resolve<void>(this.socket.destroy(error));
  }

  protected abstract onError(error: Error): void;
  protected abstract onData(data: Buffer): void;
  protected abstract onClose(): void;
}
