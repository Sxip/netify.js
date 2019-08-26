const { NetifyClient, protocol: { NullProtocol } } = require('../src');

(async () => {
  const netify = new NetifyClient({
    host: '127.0.0.1',
    port: 8080,
  }).useProtocol(NullProtocol);

  netify.on('received', message => {
    console.info(`Recieved ${message}`);
  });

  await netify.connect();
  console.log('Connected!');

  // Writes to the writer buffer
  netify.write('Hello, server!');
  netify.write('\x00');

  // Sends to the server
  await netify.flush();
})();
