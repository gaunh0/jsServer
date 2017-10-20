/**
 * Created by ADMIN on 6/3/2017.
 */

const db = require('../mysql/connection').dbConn;
const time = require('../../libs/time');
const schema = require('../../libs/mysql').schema;

module.exports = {
  create: function (table , data, callback) {
    /*data.createdAt = time.time();
    data.updatedAt = time.time();*/

    let findStr = '';
    let findData = [];
    for (let key in data) {
      findStr += key + ', ';
      findData.push(data[key])
    }
    if (findStr === '') {

    }
    else {
      findStr = findStr.substring(0, findStr.length - 2);
      findStr = '(' + findStr + ')';
      db.query('INSERT INTO '+ table + ' ' + findStr + ' VALUES ?', [[findData]], (err, result) => {
        callback(err, result)
      })
    }
  },
  delete: function (table ,data, callback) {
    let findStr = '';

    for (let key in data) {
      findStr += key + ' = "'+ data[key] +'" and ';
    }

    if (findStr === '') {
      findStr = 'DELETE * FROM ' + table;
    }
    else {
      findStr = findStr.substring(0, findStr.length - 5);
      findStr = 'DELETE FROM ' + table + ' where ' + findStr
    }

    db.query(findStr, (err, result) => {
      callback(err, result)
    })
  },
  /*find: function (table, find, callback) {
    let findStr = '';

    for (let key in find) {
      findStr += key + ' = "'+ find[key] +'" and ';
    }

    if (findStr !== '') {
      findStr = findStr.substring(0, findStr.length - 5);
      findStr = ' WHERE ' + findStr
    }

    db.query('SELECT * FROM ' + table + findStr, (err, rows) => {
      callback(err, rows)
    })
  },*/
  update: function (table ,find, data, callback) {
    data.updatedAt = time.time();

    let findStr = '';
    let updateStr = '';

    for (let key in find) {
      findStr += key + ' = "'+ find[key] +'" and ';
    }
    for (let key in data) {
      updateStr += key + ' = "'+ data[key] +'", ';
    }

    if (findStr === '' || updateStr === '') {

    }
    else {
      findStr = findStr.substring(0, findStr.length - 5);
      updateStr = updateStr.substring(0, updateStr.length - 2);
      db.query('UPDATE ' + table + ' SET ' + updateStr + ' WHERE ' + findStr, (err, result) => {
        callback(err, result)
      })
    }
  },
  find: function (table, joinTable, find, pagi, total, order, callback) {
    let selectStr = '';
    let joinStr = '';
    let findStr = '';
    let pagiStr = '';
    let orderStr = '';

    for (let key in find) {
      findStr += key + ' = "'+ find[key] +'" AND ';
    }

    if (findStr !== '') {
      findStr = findStr.substring(0, findStr.length - 5);
      findStr = ' WHERE ' + findStr
    }

    for (let key in pagi) {
      pagiStr += ' ' + key + ' '+ pagi[key];
    }

    schema[table].schema.forEach((item) => {
      selectStr += table + '.' + item + ' AS ' + table + '_' + item + ', '
    });

    joinTable.forEach((item) => {
      schema[item].schema.forEach((subItem) => {
        selectStr += item + '.' + subItem + ' AS ' + item + '_' + subItem + ', '
      });
      joinStr += ' JOIN ' + item + ' ON ' + table + '.' + schema[table].foreignKey[item]
        + '=' + item + '.' + schema[item].primaryKey
    });

    selectStr = selectStr.substring(0, selectStr.length - 2);

    if (order !== '') {
      if (order === 'ASC' || order === 'asc') {
        orderStr = ' ORDER BY ' + table + '.id ASC'
      }
      else if (order === 'DESC' || order === 'desc') {
        orderStr = ' ORDER BY ' + table + '.id DESC'
      }
    }

    db.query('SELECT ' + selectStr + ' FROM ' + table + joinStr + findStr + orderStr + pagiStr, (err, rows) => {
      if (total) {
        db.query('SELECT count(*) as total FROM ' + table, (err1, total) => {
          callback(err, rows, total[0].total)
        })
      }
      else {
        callback(err, rows)
      }
    })
  }
};
