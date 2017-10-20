/**
 * Created by ADMIN on 9/12/2017.
 */
const mysql = require('../../libs/mysql');

const ErrorCodeSchema = {
  id: {
    type: Number,
    primaryKey: true
  },
  errorCode: Number,
  str: String,
  createdAt: Date,
  updatedAt: Date,
  updatedBy: Number
};

mysql.model('error_code', ErrorCodeSchema);
