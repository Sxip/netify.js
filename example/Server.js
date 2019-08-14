const { NetifyServer } = require('../build');

(async () => {
  const netify = new NetifyServer({
    bufferSize: 1024,
    delimiter: 0x00,
    port: 8080,
  });

  netify.on('connection', async connection => {
    console.info(`New incoming connection! ${netify.connections.size}`);

    connection.on('data', async data => {
      console.info(`Received ${data}`);
      await connection.write(`${data}\x00`);
    });

    connection.on('close', () => {
      console.info('Connection closed!');
    });

    await connection.write('Hello world!\x00');
  });

  await netify.serve();
})();