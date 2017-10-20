const config = require('config');
const mysql = require('mysql');
const dbConn = mysql.createConnection(config.DB.mysql);

module.exports.dbConn = dbConn;
