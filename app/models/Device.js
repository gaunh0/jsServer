
const mysql = require('../../libs/mysql');

const DeviceSchema = {
  id: {
    type: Number,
    primaryKey: true
  },
  imei: String,
  name: String,
  status: Number,
  state: Number,
  createdAt: Date,
  updatedAt: Date,
  updatedBy: Number
};

mysql.model('device', DeviceSchema);
