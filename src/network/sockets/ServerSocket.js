'use strict';

const NetifySocket = require('./NetifySocket');

class ServerSocket extends NetifySocket {
  constructor(manager, socket) {
    super(socket);

    /**
    * The connection manager that instantiated this server socket
    * @type {ConnectionManager}
    * @readonly
    */
    Object.defineProperty(this, 'manager', { value: manager });
  }

  /**
   * Setup the socket events and protocol
   * @returns {this}
   * @public
   */
  setup() {
    this.socket.on('data', this.onData.bind(this));
    this.socket.on('close', this.onClose.bind(this));
    this.socket.on('error', this.onError.bind(this));
    return this;
  }

  /**
  * Handles data event
  * @param {Buffer} data The incoming data chunk
  * @protected
  */
  onData(data) {
    this.protocol.onData(data);
  }

  /**
   * Handles close event
   */
  onClose() {
    super.close();
    this.manager.deleteConnection(this);
  }
}

module.exports = ServerSocket;
