const { NetifyClient } = require('../build');

(async () => {
  const netify = new NetifyClient({
    bufferSize: 1024,
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

  await netify.write(`Yes\x00`);
})();