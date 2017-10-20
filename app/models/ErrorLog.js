/**
 * Created by ADMIN on 9/12/2017.
 */
const mysql = require('../../libs/mysql');

const DeviceSchema = {
  id: {
    type: Number,
    primaryKey: true
  },
  imei: String,
  errorCode: {
    type: Number,
    foreignKey: 'error_code'
  },
  time: Date
};

mysql.model('error_log', DeviceSchema);
