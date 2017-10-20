
const mysql = require('../../libs/mysql');

const DeviceUserMapSchema = {
  id: {
    type: Number,
    primaryKey: true
  },
  userId: {
    type: Number,
    foreignKey: 'user'
  },
  deviceId: {
    type: Number,
    foreignKey: 'device'
  },
  status: Number,
  owner: Number,
  createdAt: Date,
  updatedAt: Date,
  updatedBy: Number
};

mysql.model('device_user_map', DeviceUserMapSchema);
