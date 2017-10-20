/**
 * Created by nttuan on 13/05/2017.
 */

const crud = require('./crud');
const db = require('../mysql/connection').dbConn;

module.exports = {
  create: function (data, callback) {
    crud.create('device', data, callback)
  },
  delete: function (data, callback) {
    crud.delete('device', data, callback)
  },
  update: function (find, data, callback) {
    crud.update('device', find, data, callback)
  },
  find: function (find, callback) {
    crud.find('device', [], find, {}, false, '', callback)
  },
  findPagi: function (find, pagi, callback) {
    crud.find('device', [], find, pagi, true, '', callback)
  },
  findJoin: function (joinTable, find, pagi, total, callback) {
    crud.find('device', joinTable, find, pagi, total, '', callback)
  },
  searchMultiple: function (find, callback) {
    let query = '';
    let totalQuery = '';

    let imei = '';
    if (find.imei) {
      imei = 'imei LIKE "%'+ find.imei +'%"'
    }
    let name = '';
    if (find.name) {
      if (imei === '') {
        name = 'name LIKE "%' + find.name + '%"'
      }
      else {
        name = ' AND name LIKE "%' + find.name + '%"'
      }
    }
    let startDate = '';
    if (find.startDate) {
      if (imei === '' && name === '') {
        startDate = 'startingDate > "'+ find.startDate +'"'
      }
      else {
        startDate = ' AND startingDate > "'+ find.startDate +'"'
      }
    }
    let endDate = '';
    if (find.endDate) {
      if (imei === '' && name === '' && startDate === '') {
        endDate = 'startingDate < "'+ find.endDate +'"'
      }
      else {
        endDate = 'AND startingDate < "'+ find.endDate +'"'
      }
    }
    let status = '';
    if (find.status) {
      if (imei === '' && name === '' && startDate === '' && endDate === '') {
        status = 'status = ' + find.status
      }
      else {
        status = 'AND status = ' + find.status
      }
    }

    if (imei === '' && name === '' && startDate === '' && endDate === '' && status === '') {
      query = 'SELECT * FROM device';
      totalQuery = 'SELECT count(*) as total FROM device'
    }
    else {
      query = 'SELECT * FROM device WHERE ' + imei + name + startDate + endDate + status;
      totalQuery = 'SELECT count(*) as total FROM device WHERE ' + imei + name + startDate + endDate + status
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
