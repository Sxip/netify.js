const { EventEmitter } = require('events');
const { Socket } = require('net');

class NetifySocket extends EventEmitter {
  constructor(socket) {
    super();

    /**
    * The socket that instantiated this netify socket
    * @type {net.Socket}
    * @public
    */
    this.socket = socket || new Socket();

    /**
     * The protocol of this netify socket
     * @type {?Protocol}
     * @public
     */
    this.protocol = null;
  }

  /**
   * Shorthand helper method for the protocol write
   * @param {string|Buffer} message The message to write
   * @public
   */
  write(message) {
    this.protocol.write(message);
  }

  /**
   * Shorthand helper method for the protocol flush
   * @returns {Promise<number>}
   * @public
   */
  flush() {
    return this.protocol.flush();
  }

  /**
   * Handles setting the protocol of this netify socket
   * @returns {this}
   * @public
   */
  setProtocol({ Handler, options }) {
    this.protocol = new Handler(options)
      .init(this);
    return this;
  }

  /**
   * Connects to a remote host
   * @param {any} options The connect options
   * @returns {Promise<void>}
   * @public
   */
  connect(options) {
    return new Promise((resolve, reject) => {
      if (this.socket.destroyed) reject(new Error('The socket is destroyed.'));

      const onError = err => {
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

      this.socket.connect(options);
    });
  }

  /**
  *  Writes data to the socket buffer
  * @param {Buffer | string} data The data to send to the socket
  * @returns {Promise<number>}
  * @private
  */
  _writeSocketBuffer(data) {
    // eslint-disable-next-line consistent-return
    return new Promise((resolve, reject) => {
      if (!this.socket.writable || this.socket.destroyed) reject(new Error('Failed to write after end!'));

      const onceError = err => {
        this._rejected = true;
        reject(err);
      };

      if (this.socket.write(data)) {
        this.socket.off('error', onceError);
        if (!this._rejected) return resolve(data.length);
      }

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

      this.socket.once('error', onceError);
      this.socket.once('close', onceClose);
      this.socket.once('drain', onceDrain);
    });
  }

  /**
   * Removes all of the listeners for socket
   */
  dispose() {
    this.emit('dispose');

    this.socket.removeAllListeners();
    this.removeAllListeners();
  }

  /**
   * Handles socket event
   * @public
   */
  close() {
    this.emit('close');
    this.dispose();
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
   * Handles error event
   * @param {Error} error Error
   * @protected
   */
  onError(error) {
    this.emit('error', error);
  }
}

module.exports = NetifySocket;
