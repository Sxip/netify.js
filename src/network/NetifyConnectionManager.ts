import { Socket } from 'net';
import { NetifyServer } from './NetifyServer';
import { NetifyServerSocket } from './sockets/NetifyServerSocket';

export class NetifyConnectionManager {
  /**
   * Holds the amount of connected connections of this server
   */
  public readonly connections: Set<NetifyServerSocket> = new Set();

  /**
   * @param server The server that instantiated this connection manager
   */
  public constructor(public readonly server: NetifyServer) { }

  /**
   * Handles connection event
   */
  public onConnection = (socket: Socket): void => {
    const connection = this.createConnection(socket);
    this.server.emit('connection', connection);
  }

  /**
   * Handles connection closed event
   */
  public deleteConnection(socket: NetifyServerSocket): void {
    this.connections.delete(socket);
  }

  /**
   * Creates a new connection
   * @param connection The connection socket
   */
  private createConnection(connection: Socket): NetifyServerSocket {
    const client = new NetifyServerSocket(this, this.server, connection)
      .setup();

    this.connections.add(client);
    return client;
  }
}
