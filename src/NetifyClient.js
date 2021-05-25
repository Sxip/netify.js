'use strict';

const NetifySocket = require('./network/sockets/NetifySocket');
const Protocol = require('./network/protocol/Base');
const ChunkProtocol = require('./network/protocol/common/ChunkProtocol')

class NetifyClient extends NetifySocket {
  constructor(options = {}) {
    if (!options.host) throw new Error('No host has been specified.');
    if (!options.port) throw new Error('No port has been specified.');
    if (!options.rejectUnauthorized) options.rejectUnauthorized = false
    super();

    /**
     * The options the server was instantiated with
     * @type {NetifyOptions}
     * @public
     */
    this.options = options;
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

    this.setProtocol({ Handler: handler, options });
    return this;
  }

  /**
   * Connects to the remote host
   * @returns {Promise<void>}
   * @public
   */
  async connect() {
    if (!this.protocol) this.setProtocol({ Handler: ChunkProtocol })

    const { host, port, rejectUnauthorized } = this.options;
    await super.connect({ host, port, rejectUnauthorized });

    this.socket.on('data', this.onData.bind(this));
    this.socket.on('error', this.onError.bind(this));
    this.socket.on('close', this.close.bind(this));
  }
}

module.exports = NetifyClient;

