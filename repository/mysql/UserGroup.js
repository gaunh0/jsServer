const crud = require('./crud');

module.exports = {
  create: function (data, callback) {
    crud.create('userGroup', data, callback)
  },
  delete: function (data, callback) {
    crud.delete('userGroup', data, callback)
  },
  update: function (find, data, callback) {
    crud.update('userGroup', find, data, callback)
  },
  find: function (find, callback) {
    crud.find('userGroup', [], find, {}, false, '', callback)
  },
  findPagi: function (find, pagi, callback) {
    crud.find('userGroup', [], find, pagi, true, '', callback)
  },
  findJoin: function (joinTable, find, pagi, total, callback) {
    crud.find('userGroup', joinTable, find, pagi, total, '', callback)
  }
};
