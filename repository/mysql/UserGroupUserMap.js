
const crud = require('./crud');

module.exports = {
  create: function (data, callback) {
    crud.create('userGroup_user_map', data, callback)
  },
  delete: function (data, callback) {
    crud.delete('userGroup_user_map', data, callback)
  },
  update: function (find, data, callback) {
    crud.update('userGroup_user_map', find, data, callback)
  },
  find: function (find, callback) {
    crud.find('userGroup_user_map', [], find, {}, false, '', callback)
  },
  findPagi: function (find, pagi, callback) {
    crud.find('userGroup_user_map', [], find, pagi, true, '', callback)
  },
  findJoin: function (joinTable, find, pagi, total, callback) {
    crud.find('userGroup_user_map', joinTable, find, pagi, total, '', callback)
  }
};
