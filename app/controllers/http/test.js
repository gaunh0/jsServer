/**
 * Created by ADMIN on 6/1/2017.
 */

const tran = require('../../../libs/mailer');
const user = require('../../../repository/mysql/User');
const deviceUserMap = require('../../../repository/mysql/DeviceUserMap');
const device = require('../../../repository/mysql/Device');
const deviceLog = require('../../../repository/mysql/DeviceLog');
const userGroup = require('../../../repository/mysql/UserGroup');
const userGroupUserMap = require('../../../repository/mysql/UserGroupUserMap');
const time = require('../../../libs/time');
const schema = require('../../../libs/mysql').schema;

module.exports.Test = function (req, res, next) {

  deviceLog.find({id: 102}, (err, userGroup) => {
    res.json({aa: userGroup})
  });
};
