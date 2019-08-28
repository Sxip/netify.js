<div align="center">
  <br />
  <p>
    <a href="#"><img src="https://raw.githubusercontent.com/Sxip/netify.js/master/assets/Netify.png" width="150" alt="Netify.js" /></a>
  </p>
  <br />
  <p>
    <a href="https://www.npmjs.com/package/netify.js"><img src="https://img.shields.io/npm/v/netify.js.svg?style=flat&color=brightgreen" alt="NPM version" /></a>
    <a href="https://www.npmjs.com/package/netify.js"><img src="https://img.shields.io/npm/dw/netify.js" alt="NPM downloads" /></a>
    <a href="#"><img src="https://img.shields.io/npm/l/netify.js" alt="Neitfy license" /></a>
  </p>
</div>

## About

<b>Netify</b> is a [Node.js](https://nodejs.org/) module that allows you to easily create a TCP server and client.

- ⚙️ Create your own protocol.
- 🔥 Promise based.
- ⚡️ Performant.

## Getting Started

### Installation

```bash
npm i netify.js
# or yarn add netify.js
```

### Usage

Note: Before creating a server or client, you must define your own protocol or use a premade one.

**Example** - creating a netify server

```js
const { NetifyClient, Protocol: { Null } } = require('netify.js');

(async () => {
  const netify = new NetifyServer({
    port: 8080,
  }).useProtocol(Null);

  netify.on('connection', async connection => {
    console.info(`New connection!`);

    connection.write('Hello, client!');
    connection.write('\x00');

    // Sends to the connection
    await connection.flush();

    connection.on('received', message => {
      console.info(`Recieved ${message}`);
    });

    connection.on('close', () => {
      console.warn(`Connection closed!`);
    });
  });

  await netify.serve();
  console.log('Listening!');
})();
```
**Example** - creating a netify client

```js
const { NetifyClient, Protocol: { Null } } = require('netify.js');

(async () => {
  const netify = new NetifyClient({
    host: '127.0.0.1',
    port: 8080,
  }).useProtocol(Null);

  netify.on('received', message => {
    console.info(`Recieved ${message}`);
  });

  netify.on('close', () => {
    console.warn(`Connection closed!`);
  });

  await netify.connect();
  console.log('Connected!');

  netify.write('Hello, server!');
  netify.write('\x00');

  // Sends to the server
  await netify.flush();
})();
```

### Protocol

**Netify** comes with the following premade protocols.

* Delimiter  
  Used for delimiter based data

* Null  
  Used for data ending with `\x00`

* Chunk  
  Used to handle data chunks

If the premade procols do not fit your needs, you have the option to extend the protocol `Base` class and create your own protocol to fit your needs.

**Example** - Creating your own protocol class

```js
const { Protocol: { Base } } = require('netify.js');

class ExampleProtocol extends Base {
  constructor({ readBufferSize = 200, writeBufferSize = 200 } = {}) {
    super({
      readBufferSize,
      writeBufferSize,
    });
  }

  /**
   * Handle incoming buffer data
   */
  chunk(bytes) {
    
    // Emits the data to the connection
    this.push('Hello, World!');
  }
}

module.exports = ExampleProtocol;
```