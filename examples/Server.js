const { NetifyServer, protocol: { NullProtocol } } = require('../src');

(async () => {
  const netify = new NetifyServer({
    port: 8080,
  }).useProtocol(NullProtocol);

  netify.on('connection', async connection => {
    console.info(`New connection!`);

    // Writes to the writer buffer
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
