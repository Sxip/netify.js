import { Socket } from 'net';
import { NetifyServer } from '../../NetifyServer';
import { NetifyConnectionManager } from '../NetifyConnectionManager';
import { NetifyDelimiterPipe } from '../NetifyDelimiterPipe';
import { SocketHandler } from './SocketHandler';

export class NetifyServerSocket extends SocketHandler {
  /**
   * @param manager The manager that instantiated this socket
   * @param socket The socket that instantiated this socket
   */
  public constructor(
    private readonly manager: NetifyConnectionManager,
    private readonly server: NetifyServer,
    public readonly socket: Socket,
  ) {
    super(socket);

    this.stream = new NetifyDelimiterPipe(
      this.server.options.delimiter,
      this.server.options.bufferSize,
      this.server.options.bufferResize,
    );

    this.socket.pipe(this.stream);
  }

  /**
   * Setup the socket events
   */
  public setup(): this {
    this.stream.on('data', this.onData.bind(this));
    this.socket.on('close', this.onClose.bind(this));
    this.socket.on('error', this.onError.bind(this));
    return this;
  }

  /**
   * Handles error event
   * @param error
   */
  protected onError(error: Error): void {
    this.emit('error', error);
  }

  /**
   * Handles on data event
   * @param data The incoming data from the connection socket
   */
  protected onData(data: Buffer): void {
    this.emit('data', data);
  }

  /**
   * Handles close event
   */
  protected onClose(): void {
    this.emit('close');

    this.dispose();
    this.manager.deleteConnection(this);
  }
}

// tslint:disable-next-line: interface-name
export interface NetifyServerSocket {
  /**
   * Emitted when connection receives a chuck of data
   */
  on(event: 'data', listener: (data: Buffer) => void): this;

  /**
   * Emitted when connection receives an error
   */
  on(event: 'error', listener: (error: Error) => void): this;

  /**
   * Emitted when connection is closed
   */
  on(event: 'close', listener: () => void): this;

  /**
   * Emitted when connection receives a chuck of data
   */
  once(event: 'data', listener: (data: Buffer) => void): this;

  /**
   * Emitted when connection receives an error
   */
  once(event: 'error', listener: (error: Error) => void): this;

  /**
   * Emitted when connection is closed
   */
  once(event: 'close', listener: () => void): this;
}
