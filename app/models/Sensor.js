
const mysql = require('../../libs/mysql');

const SensorSchema = {
  id: {
    type: Number,
    primaryKey: true
  },
  sid: String,
  name: String,
  temp: Number,
  humi: Number,
  lux : Number,
  hid: Number,
  rid: Number,
  createdAt: Date,
  updatedAt: Date,
  updatedBy: Number
};

mysql.model('sensor', SensorSchema);
