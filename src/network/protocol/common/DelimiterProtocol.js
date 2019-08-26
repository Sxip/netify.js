const Protocol = require('../Protocol');

class DelimiterProtocol extends Protocol {
  constructor({ readBufferSize, writeBufferSize, delimiter } = {}) {
    if (!delimiter) throw new Error('No delimiter specified.');

    super({
      readBufferSize,
      writeBufferSize,
    });

    /**
     * The delimiter of this protocol
     * @type {string}
     * @private
     */
    this._delimiter = delimiter;
  }

  /**
    * Handles the socket data chunks
    */
  chunk() {
    do {
      const message = this.reader.readUntil(this._delimiter);
      if (message === null) break;

      this.push(message);
    } while (this.reader.length);

    if (!this.reader.length) this.reader.reset();
    else if (this.reader.capacity / 2 < this.reader.offset) this.reader.drain();
  }
}

module.exports = DelimiterProtocol;
