const Protocol = require('../Base');

class ChunkProtocol extends Protocol {
  constructor({ readBufferSize, writeBufferSize } = {}) {
    super({
      readBufferSize,
      writeBufferSize,
    });
  }

  /**
    * Handles the socket data chunks
    * @param {number} bytes The number of bytes recieved from the chunk
    * @abstract
    */
  chunk(bytes) {
    const message = this.reader.read(bytes);
    this.push(message);

    if (!this.reader.length) this.reader.reset();
  }
}

module.exports = ChunkProtocol;
