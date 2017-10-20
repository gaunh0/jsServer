const net = require('net');
const random = require('randomstring');
const device = require('../app/controllers/socket/device');

const server = net.createServer((c) => {
  // 'connection' listener
  console.log('client connected');
  c.on('end', () => {
    console.log('client disconnected');
  });

  c.id = random.generate(10);

  c.on('data', (data) => {
    let array = data.toString().split(';');
    let object = {};

    switch (array[0]) {
      case '@PING':
        c.write(device.ping());
        break;
      case '@REGISTER':
        object.did = array[1];
        c.write(device.register(object.did));
        break;
      default:
        c.write(device.rerror());
        break;
    }
  });
  // set timeout to disconect
  c.setTimeout(10000);
  c.on('timeout', () => {
    console.log('socket timeout');
    c.end();
  });

  c.write('Hello \r\n');
//  c.pipe(c);
});

server.on('error', (err) => {
  throw err;
});

server.listen(3001, () => {
  console.log('server bound');
});
