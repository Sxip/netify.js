'use strict';

const ServerSocket = require('./sockets/ServerSocket');

class ConnectionManager {
  constructor(server) {
    /**
     * The server that instantiated this connection manager
     * @type {NetifyServer}
     * @readonly
     */
    Object.defineProperty(this, 'server', { value: server });

    /**
     * Holds the amount of connected connections
     * @type {Map<ServerSocket>}
     * @private
     */
    this._connections = new Set();
  }

  /**
   * Broadcasts a message to all connected connections
   * @param {string|Buffer} message The message to broadcast
   * @returns {Promise<number[]>}
   * @public
   */
  broadcast(message) {
    const promises = [];

    for (const connection of this._connections) {
      promises.push((() => {
        connection.write(message);
        return connection.flush();
      })());
    }
    return Promise.all(promises);
  }

  /**
   * Closes all of the connected connections
   * @returns {Promise<any[]>}
   * @puiblic
   */
  closeConnections() {
    const promises = [];

    for (const connection of this._connections) {
      promises.push(connection.destroy());
    }
    return Promise.all(promises);
  }

  /**
   * Handles connection event
   * @param {net.Socket} socket The connection socket instance
   * @public
   */
  onConnection(socket) {
    const connection = this._createConnection(socket);
    this.server.emit('connection', connection);
  }

  /**
   * Deletes the connection from the connections set
   * @param {NetifyServerSocket} connection The connection to delete
   * @public
   */
  deleteConnection(connection) {
    this._connections.delete(connection);
  }

  /**
   * Creates a new connection
   * @param {net.Socket} socket The connection socket instance
   * @returns {NetifyServerSocket}
   * @private
   */
  _createConnection(socket) {
    const client = new ServerSocket(this, socket)
      .setProtocol(this.server.netifyProtocol)
      .setup();

    this._connections.add(client);
    return client;
  }
}

module.exports = ConnectionManager;
