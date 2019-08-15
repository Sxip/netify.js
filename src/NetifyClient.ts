import { defaultOptions } from './Constants';
import { NetifyDelimiterPipe } from './network/NetifyDelimiterPipe';
import { SocketHandler } from './network/sockets/SocketHandler';
import { ISocketOptions } from './network/sockets/SocketOptions';

/**
 * The options of this client
 */
interface INetifyClientOptions extends ISocketOptions {
  /**
   * Listening port of this server
   */
  port: number;

  /**
   * Host of this server
   */
  host: string;
}

export class NetifyClient extends SocketHandler {
  /**
   * @param [options] Options of this client
   */
  public constructor(
    private readonly options: INetifyClientOptions,
  ) {
    super();

    this.options = { ...defaultOptions, ...options };

    this.stream = new NetifyDelimiterPipe(
      this.options.delimiter,
      this.options.bufferSize,
      this.options.bufferResize,
    );

    this.socket.pipe(this.stream);
  }

  /**
   * Connects to the remote host
   */
  public async connect(): Promise<void> {
    await new Promise((resolve, reject) => {
      if (this.socket.destroyed) reject(new Error('The socket is destroyed.'));

      const onError = (err: Error) => {
        this.socket.off('error', onError);
        this.socket.off('connect', onConnected);
        reject(err);
      };

      const onConnected = () => {
        this.socket.off('error', onError);
        this.socket.off('connect', onConnected);
        resolve();
      };

      this.socket.once('error', onError);
      this.socket.once('connect', onConnected);

      const { host, port } = this.options;
      this.socket.connect({ host, port });
    });

    this.stream.on('data', this.onData.bind(this));
    this.socket.on('error', this.onError.bind(this));
    this.socket.on('close', this.onClose.bind(this));
  }

  protected onError(error: Error): void {
    this.emit('error', error);
  }

  protected onData(data: Buffer): void {
    this.emit('data', data);
  }

  protected onClose(): void {
    this.emit('close');
    this.dispose();
  }
}

// tslint:disable-next-line: interface-name
export interface NetifyClient {
  /**
   * Emitted when the client receives data
   */
  on(event: 'data', listener: (data: Buffer) => void): this;

  /**
   * Emitted when the client receives an error
   */
  on(event: 'error', listener: (error: Error) => void): this;

  /**
   * Emitted when the connection is closed
   */
  on(event: 'close', listener: () => void): this;

  /**
   * Emitted when the client receives data
   */
  once(event: 'data', listener: (data: Buffer) => void): this;

  /**
   * Emitted when the client receives an error
   */
  once(event: 'error', listener: (error: Error) => void): this;

  /**
   * Emitted when the connection is closed
   */
  once(event: 'close', listener: () => void): this;
}
