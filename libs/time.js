/**
 * Created by nttuan on 09/05/2017.
 */
const moment = require('moment');

module.exports = {
  unix: function () {
    return new Date().getTime();
  },
  time: function () {
    return moment().format('YYYY-MM-DD HH:mm:ss')
  }
};
