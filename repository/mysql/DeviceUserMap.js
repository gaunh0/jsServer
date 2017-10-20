/**
 * Created by ADMIN on 6/3/2017.
 */
const crud = require('./crud');

module.exports = {
  create: function (data, callback) {
    crud.create('device_user_map', data, callback)
  },
  delete: function (data, callback) {
    crud.delete('device_user_map', data, callback)
  },
  update: function (find, data, callback) {
    crud.update('device_user_map', find, data, callback)
  },
  find: function (find, callback) {
    crud.find('device_user_map', [], find, {}, false, '', callback)
  },
  findPagi: function (find, pagi, callback) {
    crud.find('device_user_map', [], find, pagi, true, '', callback)
  },
  findJoin: function (joinTable, find, pagi, total, callback) {
    crud.find('device_user_map', joinTable, find, pagi, total, '', callback)
  }
};
