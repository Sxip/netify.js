const Protocol = require('../Base');

class NullProtocol extends Protocol {
  constructor({ readBufferSize, writeBufferSize } = {}) {
    super({
      readBufferSize,
      writeBufferSize,
    });
  }

  /**
    * Handles the socket data chunks
    */
  chunk() {
    do {
      const message = this.reader.readCString();
      if (!message) break;

      this.push(message);
    } while (this.reader.length);

    if (!this.reader.length) this.reader.reset();
    else if (this.reader.capacity / 2 < this.reader.offset) this.reader.drain();
  }
}

module.exports = NullProtocol;
