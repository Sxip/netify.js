const ByteBuffer = require('../buffer');

class Protocol {
  constructor({ readBuffer = 1024, writeBuffer = 1024 } = {}) {
    /**
     * The read buffer size of this protocol
     * @type {ByteBuffer}
     * @protected
     */
    this._readBuffer = new ByteBuffer(writeBuffer);

    /**
     * The write buffer size of this protocol
     * @type {ByteBuffer}
     * @protected
     */
    this._writeBuffer = new ByteBuffer(readBuffer);

    /**
     * The netify socket of this protocol
     * @type {?NetifySocket}
     * @protected
     */
    this.netifySocket = null;
  }

  /**
   * Getter for the readbuffer
   * @readonly
   */
  get reader() {
    return this._readBuffer;
  }

  /**
   * Getter for the writebuffer
   * @readonly
   */
  get writer() {
    return this._writeBuffer;
  }

  /**
   * Initializes the protocol with the netify socket
   * @param {NetifySocket} netifySocket The netify socket
   * @returns {this}
   * @public
   */
  init(netifySocket) {
    this.netifySocket = netifySocket;
    return this;
  }

  /**
   * Flushes any remaning data on the write buffer
   * @returns {Promise<number>}
   * @public
   */
  flush() {
    const promise = this.netifySocket._writeSocketBuffer(this._writeBuffer.buffer);
    this._writeBuffer.reset();
    return promise;
  }

  /**
   * Writes to the write buffer
   * @param {string|Buffer} message The message to write
   * @public
   */
  write(message) {
    if (typeof message === 'string') {
      this.writer.writeString(message);
    } else if (message instanceof Buffer) {
      this.writer.write(message);
    } else {
      throw new TypeError('Type not supported.');
    }
  }

  /**
   * Emits the built message from data to the socket
   * @param {any} message The message to emit
   * @protected
   */
  push(message) {
    this.netifySocket.emit('received', message);
  }

  /**
   * Handles the data socket event
   * @param {Buffer} data The data chunk
   * @public
   */
  onData(data) {
    this._readBuffer.write(data);
    this.chunk(data.length);
  }

  chunk() {
    throw new Error('Method not implemented.');
  }
}

module.exports = Protocol;
