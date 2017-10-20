
const mysql = require('../../libs/mysql');

const UserGroupSchema = {
  id: {
    type: Number,
    primaryKey: true
  },
  name: String,
  level: Number,
  status: Number,
  createdAt: Date,
  updatedAt: Date,
  updatedBy: Number
};

mysql.model('userGroup', UserGroupSchema);
