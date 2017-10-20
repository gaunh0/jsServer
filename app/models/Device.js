
const mysql = require('../../libs/mysql');

const SensorSchema = {
  id: {
    type: Number,
    primaryKey: true
  },
  did: String,
  name: String,
  status: Number,
  type: Number,
  hid: Number,
  rid: Number,
  uid: Number,
  createdAt: Date,
  updatedAt: Date,
  updatedBy: Number
};

mysql.model('device', SensorSchema);
