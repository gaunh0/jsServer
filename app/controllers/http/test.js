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
  /*console.log(req.query);
  res.json({param: req.query})*/
  /*deviceUserMap.find({}, (err, deviceUserMap) => {
    deviceUserMap.forEach(function (value, index) {
      user.find({id: value.userId}, (err, user) => {
        deviceUserMap[index].userId = user
      });
      device.find({id: value.deviceId}, (err, device) => {
        deviceUserMap[index].deviceId = device
      })
    });
    setTimeout(function () {
      res.json(deviceUserMap)
    }, 1000)
  })*/
  /*userGroup.update({id: 3}, {name: 'Customer', status: 1}, (err, userGroup) => {
    res.json({err: err, user: userGroup})
  })*/
  /*user.create({id: 2}, (err, user) => {
    res.json({err: err, user: user})
  })*/
  deviceLog.find({id: 102}, (err, userGroup) => {
    res.json({aa: userGroup})
  });
};
