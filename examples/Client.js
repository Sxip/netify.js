const { NetifyClient, Protocol: { Null } } = require('../src');

(async () => {
  const netify = new NetifyClient({
    host: '127.0.0.1',
    port: 8080,
  }).useProtocol(Null);

  netify.on('received', message => {
    console.info(`Recieved ${message}`);
  });

  netify.on('close', () => {
    console.log('Connection closed!');
  });

  await netify.connect();
  console.log('Connected!');

  // Writes to the writer buffer
  netify.write('Hello, server!');
  netify.write('\x00');

  // Sends to the server
  await netify.flush();
})();
