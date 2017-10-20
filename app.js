const fs = require('fs');
const express = require('express');
const app = express();
const cors = require('cors');
const config = require('config');
const mongoose = require('mongoose');
const http = require('http');
const socket = require('./routes/socket');

const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const debug = require('debug')('exampleproject:server');

const httpServer = http.createServer(app);

const route = require('./routes/http');

let URL_MONGODB = '';

if (config.DB.mongo.user !== undefined && config.DB.mongo.pass !== undefined) {
  URL_MONGODB = 'mongodb://' + config.DB.mongo.user + ':' + config.DB.mongo.pass + '@' + config.DB.mongo.host
    + ':' + config.DB.mongo.port + '/' + config.DB.mongo.database
}
else {
  URL_MONGODB = 'mongodb://' + config.DB.mongo.host + ':' + config.DB.mongo.port + '/' + config.DB.mongo.database
}

/*mongoose.connect(URL_MONGODB, function (err) {
  if (err) {
    console.log(err)
  }
  else {
    console.log('MongoDB connect OK')
  }
});*/

app.use(cors());

app.options('*', cors());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'ejs');

app.use(route);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('Not found')
});

/**
 * Get port from environment and store in Express.
 */

let port = normalizePort(process.env.PORT || '3000');
//app.set('port', port);

httpServer.listen(port, function () {
  console.log('HTTP listening on ' + port);
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  let addr = server.address();
  let bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

require('./app/models/User');
require('./app/models/UserGroup');
require('./app/models/Sensor');
require('./app/models/Device');
require('./app/models/Home');

