const Protocol = require('../src/network/protocol/Base');

class ExampleProtocol extends Protocol {
  constructor({ readBufferSize = 200, writeBufferSize = 200 } = {}) {
    super({
      readBufferSize,
      writeBufferSize,
    });
  }

  /**
    * Handles the socket data chunks
    */
  chunk() {
    // Handle chunks

    this.push('Hello, World!');
  }
}

module.exports = ExampleProtocol;
