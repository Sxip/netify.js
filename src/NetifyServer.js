'use strict';

const { EventEmitter } = require('events');
const { Server } = require('net');
const ConnectionManager = require('./network/ConnectionManager');
const Protocol = require('./network/protocol/Base');
const ChunkProtocol = require('./network/protocol/common/ChunkProtocol');

class NetifyServer extends EventEmitter {
  constructor(options = {}) {
    if (!options.port) throw new Error('No port has been specified.');
    super();

    /**
     * The options the server was instantiated with
     * @type {NetifyOptions}
     * @public
     */
    this.options = options;

    /**
     * The internal net.Server instance
     * @type {?net.Server}
     * @public
     */
    this._server = null;

    /**
     * The connection manager of this server
     * @type {ConnectionManager}
     * @private
     */
    this._connectionManager = new ConnectionManager(this);

    /**
     * The protocol of this server
     * @type {object}
     * @private
     */
    this._netifyProtocol = {
      Handler: null,
      options: {}
    };
  }

  /**
   * Getter for the protocol handler object
   * @readonly
   */
  get netifyProtocol() {
    return this._netifyProtocol;
  }

  /**
   * Getter for the connected connections
   * @readonly
   */
  get connections() {
    return this._connectionManager.connections;
  }

  /**
   * Broadcasts a message to all connected connections
   * @param {string|Buffer} message The message to broadcast
   * @returns {Promise<any[]>}
   * @public
   */
  broadcast(message) {
    return this._connectionManager.broadcast(message);
  }

  /**
  * Closes all of the connected connections
  * @returns {Promise<any[]>}
  * @puiblic
  */
  closeConnections() {
    return this._connectionManager.closeConnections();
  }

  /**
   * Sets the protocol handler
   * @param {Protocol} handler The protocol handler
   * @param {Object} options The protocol handler options
   * @returns {this}
   * @public
   */
  useProtocol(handler, options = {}) {
    if (!(handler.prototype instanceof Protocol)) throw new Error('Invalid protocol handler.');
    if (typeof options !== 'object') throw new TypeError('Options must be a typeof object.');
    if (!handler) throw new Error('No handler has been specified.');

    this._netifyProtocol = { Handler: handler, options };
    return this;
  }

  /**
   * Create socket and begin listening for new connections
   * @returns {Promise<void>}
   * @public
   */
  async serve() {
    await new Promise((resolve, reject) => {
      if (this._server) reject(new Error('The server has already been instantiated.'));
      if (!this._netifyProtocol.Handler) this._netifyProtocol.Handler = ChunkProtocol

      this._server = new Server();

      const dispose = () => {
        this._server.off('listening', onceListening);
        this._server.off('error', onceError);
        this._server.off('close', onceClose);
      };

      const onceListening = () => {
        resolve();
      };

      const onceClose = error => {
        dispose();
        reject(error);
      };

      const onceError = () => {
        dispose();
      };

      this._server.once('listening', onceListening);
      this._server.once('error', onceError);

      const { host, port } = this.options;
      this._server.listen({ host, port });
    });

    this._server.on('connection', socket => this._connectionManager.onConnection(socket));
    this._server.on('error', this.onError.bind(this));
  }

  /**
   * Handles server error event
   * @param {Error} error The error received
   * @public
   */
  onError(error) {
    this.emit('error', error);
  }

  /**
   * Disconnect the server
   * @public
   */
  async close() {
    await this.closeConnections();

    await new Promise((resolve, reject) => {
      this._server.close(error => {
        if (error) reject(error);
        else resolve();
      });
    });
    this.emit('close');
  }
}

module.exports = NetifyServer;
