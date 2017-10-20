/**
 * Created by ADMIN on 9/5/2017.
 */

const crud = require('./crud');
const db = require('../mysql/connection').dbConn;

module.exports = {
  create: function (data, callback) {
    crud.create('device_log', data, callback)
  },
  find: function (find, callback) {
    crud.find('device_log', [], find, {}, false, '', callback)
  },
  searchMultiple: function (find, callback) {
    let query = '';
    let totalQuery = '';

    let imei = '';
    if (find.imei) {
      imei = 'imei LIKE "%'+ find.imei +'%"'
    }

    let account = '';
    if (find.account) {
      if (imei === '') {
        account = 'account LIKE "%' + find.account + '%"'
      }
      else {
        account = ' AND account LIKE "%' + find.account + '%"'
      }
    }

    let startDate = '';
    if (find.startDate) {
      if (imei === '' && account === '') {
        startDate = 'time > "'+ find.startDate +'"'
      }
      else {
        startDate = ' AND time > "'+ find.startDate +'"'
      }
    }

    let endDate = '';
    if (find.endDate) {
      if (imei === '' && account === '' && startDate === '') {
        endDate = 'time < "'+ find.endDate +'"'
      }
      else {
        endDate = 'AND time < "'+ find.endDate +'"'
      }
    }

    if (imei === '' && account === '' && startDate === '' && endDate === '') {
      query = 'SELECT * FROM device_log ORDER BY id DESC';
      totalQuery = 'SELECT count(*) as total FROM device_log'
    }
    else {
      query = 'SELECT * FROM device_log WHERE ' + imei + account + startDate + endDate + ' ORDER BY id DESC';
      totalQuery = 'SELECT count(*) as total FROM device_log WHERE ' + imei + account + startDate + endDate
    }

    if (find.limit !== undefined && find.offset !== undefined) {
      query += ' LIMIT ' + parseInt(find.limit) + ' OFFSET ' + parseInt(find.offset)
    }

    db.query(query, (err, rows) => {
      db.query(totalQuery, (err1, total) => {
        callback(err, rows, total[0].total)
      })
    })
  }
};
