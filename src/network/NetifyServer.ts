import { EventEmitter } from 'events';
import { Server } from 'net';
import { defaultOptions } from '../Constants';
import { NetifyConnectionManager } from './NetifyConnectionManager';
import { NetifyServerSocket } from './sockets/NetifyServerSocket';
import { ISocketOptions } from './sockets/SocketOptions';

/**
 * The options of this server
 */
interface INetifyServerOptions extends ISocketOptions {
  /**
   * Listening port of this server
   */
  port?: number;

  /**
   * Host of this server
   */
  host?: string;
}

export class NetifyServer extends EventEmitter {
  /**
   * The internal net.Server instance
   */
  public server: Server;

  /**
   * The connection manager of this server
   */
  private readonly connectionManager: NetifyConnectionManager;

  /**
   * @param [options] Options of this server
   */
  public constructor(public readonly options: INetifyServerOptions) {
    super();

    this.options = { ...defaultOptions, ...options };
    this.connectionManager = new NetifyConnectionManager(this);
  }

  /**
   * Gets the connected connections of this server
   */
  public get connections(): Set<NetifyServerSocket> {
    return this.connectionManager.connections;
  }

  /**
   * Create socket and begin listening for new connections
   */
  public async serve(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      if (this.server) reject(new Error('The server has already been instantiated!'));

      this.server = new Server();

      const dispose = () => {
        this.server.off('listening', onceListening);
        this.server.off('error', onceError);
        this.server.off('close', onceClose);
      };

      const onceListening = () => {
        resolve();
      };

      const onceClose = (error: Error) => {
        dispose();
        reject(error);
      };

      const onceError = () => {
        dispose();
      };

      this.server.once('listening', onceListening);
      this.server.once('error', onceError);

      const { host, port } = this.options;
      this.server.listen({ host, port });
    });

    this.server.on('connection', this.connectionManager.onConnection.bind(this));
    this.server.on('error', this.onError.bind(this));
  }

  /**
   * Broadcasts a packet to all of the connected connections
   * @param data The data to send to other sockets
   */
  public broadcast(data: any): Promise<any[]> {
    const promises = [];

    for (const connection of this.connectionManager.connections) promises.push(connection.write(data));
    return Promise.all(promises);
  }

  /**
   * Handles server error event
   * @param error The error received
   */
  private onError(error: Error): void {
    this.emit('error', error);
  }
}

// tslint:disable-next-line: interface-name
export interface NetifyServer {
  /**
   * Emitted when the server receives a new connection
   */
  on(event: 'connection', listener: (connection: NetifyServerSocket) => void): this;

  /**
   * Emitted when the server receives an error
   */
  on(event: 'error', listener: (error: Error) => void): this;

  /**
   * Emitted when the server receives a new connection
   */
  once(event: 'connection', listener: (connection: NetifyServerSocket) => void): this;

  /**
   * Emitted when the server receives an error
   */
  once(event: 'error', listener: (error: Error) => void): this;
}
