const mysql = require('../../libs/mysql');

const DeviceLogSchema = {
  id: {
    type: Number,
    primaryKey: true
  },
  imei: String,
  latitude: String,
  longitude: String,
  altitude: String,
  batteryPercentage: Number,
  gpsStatus: Number,
  bleStatus: Number,
  wifiStatus: Number,
  _3gStatus: Number,
  _3gLevel: Number,
  acceleratedValue: Number,
  acceleratorStatus: Number,
  altimeterStatus: Number,
  velocity: Number,
  time: Date,
  oneClick: Number,
  twoClick: Number,
  longPress5s: Number,
  longPress10s: Number,
  ringStatus: Number,
  chargeStatus: Number,
  dischargeStatus: Number,
  batteryRemainTime: Number,
  vibrateStatus: Number,
  GPSCourse: String,
  errorCode: Number
};

mysql.model('device_log', DeviceLogSchema);
