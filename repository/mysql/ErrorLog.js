/**
 * Created by ADMIN on 9/12/2017.
 */

const crud = require('./crud');
const db = require('../mysql/connection').dbConn;

module.exports = {
  create: function (data, callback) {
    crud.create('error_log', data, callback)
  },
  find: function (find, callback) {
    crud.find('error_log', [], find, {}, false, '', callback)
  },
  findJoin: function (find, pagi, callback) {
    let query = '';
    let totalQuery = '';
    let pagiStr = '';

    for (let key in pagi) {
      pagiStr += ' ' + key + ' '+ pagi[key];
    }

    if (find.imei === undefined) {
      query = 'SELECT error_log.*, error_code.str FROM error_log, error_code WHERE error_log.errorCode = error_code.errorCode';
      totalQuery = 'SELECT count(*) as total FROM error_log'
    }
    else {
      query = 'SELECT error_log.*, error_code.str FROM error_log, error_code WHERE error_log.errorCode = error_code.errorCode AND error_log.imei = \'' + find.imei + '\'';
      totalQuery = 'SELECT count(*) as total FROM error_log WHERE imei = \'' + find.imei + '\''
    }

    db.query(query + ' ORDER BY error_log.id DESC' + pagiStr, (err, rows) => {
      db.query(totalQuery, (err1, total) => {
        callback(err, rows, total[0].total)
      })
    })
  }
};
