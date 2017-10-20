
const DeviceLog = require('../../app/models/Home');
const time = require('../../libs/time');

module.exports = {
  create: function (data, callback) {
    data.createdAt = time.unix();
    data.updatedAt = time.unix();
    let deviceLog = new DeviceLog(data);

    deviceLog.save((err, result) => {
      callback(err, result)
    })
  },
  find: function (data, callback) {
    DeviceLog.find(data, (err, result) => {
      callback(err, result)
    })
  },
  update: function (find, data, callback) {
    data.updatedAt = time.unix();
    DeviceLog.findOneAndUpdate(find, data, (err, result) => {
      callback(err, result)
    })
  },
  delete: function (data, callback) {
    DeviceLog.findOneAndRemove(data, err => {
      callback(err)
    })
  }
};
