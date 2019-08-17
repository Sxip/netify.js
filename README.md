# Netify

<img src="https://raw.githubusercontent.com/Sxip/netify.js/master/assets/Netify.png" align="right">

[![NPM netify.js package](https://img.shields.io/npm/v/netify.js.svg?style=flat&color=brightgreen)](https://npmjs.org/package/netify.js) [![NPM neitfy downloads](https://img.shields.io/npm/dw/netify.js)](https://npmjs.org/package/netify.js) [![NPM neitfy license](https://img.shields.io/npm/l/netify.js)](https://npmjs.org/package/netify.js)

> <b>Netify</b> is a [Node.js](https://nodejs.org/) module that allows you to easily create a TCP server and client.

###### What can it do?

* ✂️ Use delimiter for boundary between data.
* ⚙️ Set the size of the socket data buffer allocation.
* ✨ Automatically increase the socket data buffer allocation size when needed.

## Getting Started

### Installation

```bash
npm i netify.js
# or yarn add netify.js
```

### Usage

Note: It is recommended that you create a larger buffer size, so there isn't as many reallocations for a bigger buffer.

The default buffer size is `8,192` bytes however you are free to change to your own size.

**Example** - creating a netify server

```js
(async () => {
  const netify = new NetifyServer({
    bufferSize: 1024,
    delimiter: 0x00,
    port: 8080,
  });

  netify.on('connection', async connection => {
    console.info(`New incoming connection! ${netify.connections.size}`);

    connection.on('data', data => {
      console.info(`Received ${data}`);
    });

    connection.on('close', () => {
      console.info('Connection closed!');
    });

    await connection.write('Hello world!');
    await connection.write('\x00');
  });
  
  await netify.serve();
})();
```
**Example** - creating a netify client

```js
(async () => {
  const netify = new NetifyClient({
    bufferSize: 1024,
    delimiter: 0x00,
    host: '127.0.0.1',
    port: 8080,
  });

  netify.on('data', data => {
    console.info(`Received ${data}`);
  });

  netify.on('close', () => {
    console.info('Connected closed!');
  });

  await netify.connect();
  console.info('Connected to the server!');

  await netify.write('Hello World!');
  await netify.write('\x00');
})();
```