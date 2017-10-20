/**
 * Created by nttuan on 19/05/2017.
 */

const device = require('../../../repository/mysql/Device');
const deviceLog = require('../../../repository/mysql/DeviceLog');
const response = require('../../../global/response');
const time = require('../../../libs/time');
const define = require('../../../global/define');
const resCode = require('../../../utilities/response/code');

module.exports = {
  ping: function (data) {
    console.log(data);
    return JSON.stringify({cmd: '@RPING', imei: data.imei, rcode: 200});
  }
};
