/**
 * Created by nttuan on 13/05/2017.
 */

const crud = require('./crud');
const db = require('../mysql/connection').dbConn;
const schema = require('../../libs/mysql').schema;

module.exports = {
  create: function (data, callback) {
    crud.create('user', data, callback)
  },
  delete: function (data, callback) {
    crud.delete('user', data, callback)
  },
  update: function (find, data, callback) {
    crud.update('user', find, data, callback)
  },
  find: function (find, callback) {
    crud.find('user', [], find, {}, false, '', callback)
  },
  findPagi: function (find, pagi, callback) {
    crud.find('user', [], find, pagi, true, '', callback)
  },
  findJoin: function (joinTable, find, pagi, total, callback) {
    crud.find('user', joinTable, find, pagi, total, '', callback)
  },
  searchMultiple: function (find, callback) {
    let query = '';
    let totalQuery = '';
    let selectStr = '';
    let joinTable = ['user', 'userGroup', 'userGroup_user_map'];

    let account = '';
    if (find.account) {
      account = 'user.account LIKE "%'+ find.account +'%"'
    }

    let name = '';
    if (find.name) {
      if (account === '') {
        name = 'user.name LIKE "%' + find.name + '%"'
      }
      else {
        name = ' AND user.name LIKE "%' + find.name + '%"'
      }
    }

    let phone = '';
    if (find.phone) {
      if (account === '' && name === '') {
        phone = 'user.phone LIKE "%' + find.phone + '%"'
      }
      else {
        phone = ' AND user.phone LIKE "%' + find.phone + '%"'
      }
    }

    let userGroupId = '';
    if (find.userGroupId) {
      if (name === '' && phone === '' && account === '') {
        userGroupId = 'userGroup.id = ' + find.userGroupId
      }
      else {
        userGroupId = 'AND userGroup.id = ' + find.userGroupId
      }
    }

    joinTable.forEach((item) => {
      schema[item].schema.forEach((subItem) => {
        selectStr += item + '.' + subItem + ' AS ' + item + '_' + subItem + ', '
      })
    });
    selectStr = selectStr.substring(0, selectStr.length - 2);

    if (name === '' && account === '' && phone === '' && userGroupId === '') {
      query = 'SELECT ' + selectStr
        + ' FROM userGroup_user_map JOIN user ON userGroup_user_map.userId=user.id JOIN userGroup ON userGroup_user_map.userGroupId=userGroup.id';
      totalQuery = 'SELECT count(*) as total FROM userGroup_user_map JOIN user ON userGroup_user_map.userId=user.id JOIN userGroup ON userGroup_user_map.userGroupId=userGroup.id'
    }
    else {
      query = 'SELECT ' + selectStr
        + ' FROM userGroup_user_map JOIN user ON userGroup_user_map.userId=user.id JOIN userGroup ON userGroup_user_map.userGroupId=userGroup.id WHERE '
        + account + name + phone + userGroupId;
      totalQuery = 'SELECT count(*) as total FROM userGroup_user_map JOIN user ON userGroup_user_map.userId=user.id JOIN userGroup ON userGroup_user_map.userGroupId=userGroup.id WHERE '
        + account + name + phone + userGroupId
    }

    if ((find.limit !== undefined && find.limit !== '') &&
      (find.offset !== undefined && find.offset !== '')) {
      query += ' LIMIT ' + parseInt(find.limit) + ' OFFSET ' + parseInt(find.offset)
    }

    db.query(query, (err, rows) => {
      db.query(totalQuery, (err1, total) => {
        callback(err, rows, total[0].total)
      })
    })
  }
};
