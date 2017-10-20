const net = require('net');
const random = require('randomstring');
const device = require('../app/controllers/socket/device');

const server = net.createServer((c) => {
  // 'connection' listener
  console.log('client connected');
  c.on('end', () => {
    console.log('client disconnected');
  });

  c.id = random.generate(7);

  c.on('data', (data) => {
    let array = data.toString().split(';');
    let object = {};

    object.cmd = array[0];
    object.imei = array[1];
    switch (array[0]) {
      case '@PING':
        c.write(device.ping(object));
        break;
    }
  });

  c.setTimeout(1000);

  c.on('timeout', () => {
    console.log('socket timeout');
    c.end();
  });

  c.write('hello\r\n');
  //c.pipe(c);
});

server.on('error', (err) => {
  throw err;
});

server.listen(3001, () => {
  console.log('server bound');
});
